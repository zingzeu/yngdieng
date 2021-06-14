using System.Collections.Generic;
using System.Collections.Immutable;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Common.RichText;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using static Yngdieng.Common.StringExt;
using Word = Yngdieng.Frontend.V3.Protos.Word;
using WordList = Yngdieng.Frontend.V3.Protos.WordList;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Words
    {
        public enum Mode
        {
            Full,
            Snippet
        }

        public static async Task<Word> GetWord(
            IIndexHolder _indexHolder,
            AdminContext _dbContext,
            ZhConverter zhConverter,
            DocRef docRef,
            Mode mode = Mode.Full)
        {
            var maybeYngdiengDocument = _indexHolder.GetIndex().YngdiengDocuments
                .SingleOrDefault(yDoc => yDoc.DocId == DocRefs.Encode(docRef));
            var maybeWordId = string.IsNullOrEmpty(docRef.ZingzeuId)
                ? (int?)null : int.Parse(docRef.ZingzeuId, NumberStyles.HexNumber);
            var maybeWord = maybeWordId == null
                ? null
                : await _dbContext.Words
                    .Where(w => w.WordId == maybeWordId)
                    .Include(w => w.PreferredSandhiAudio)
                    .SingleOrDefaultAsync();
            if (maybeYngdiengDocument == null && maybeWord == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Not found."));
            }
            var extensions = await _dbContext.Extensions.Where(e => e.WordId == maybeWordId).ToListAsync();
            var prons = await _dbContext.Prons.Where(p => p.WordId == maybeWordId).ToListAsync();
            var hanzi = zhConverter.tH(await GetHanzi(_dbContext, maybeYngdiengDocument, maybeWordId));
            var recommendedProns = mode == Mode.Snippet
                ? PronChooser.GetSnippetPronunciations(maybeYngdiengDocument, prons, maybeWord?.PreferredSandhiAudio)
                : PronChooser.GetRecommendedPronunciations(maybeYngdiengDocument, prons, maybeWord?.PreferredSandhiAudio);
            var explanations = mode == Mode.Snippet
                ? Enumerable.Empty<RichTextNode>()
                : GetExplanations(zhConverter, hanzi, maybeYngdiengDocument, extensions);
            var audioCards = mode == Mode.Snippet ? Enumerable.Empty<Word.Types.AudioCard>()
                : await GetAudioCards(_dbContext, recommendedProns, maybeWordId);
            var wordLists = mode == Mode.Full && maybeWordId.HasValue
                ? await Queries.QueryWordListsByWordId(_dbContext, maybeWordId.Value).Select(wl => Renderers.ToWordList(wl)).ToListAsync()
                : Enumerable.Empty<WordList>();
            return new Word
            {
                Name = ResourceNames.ToWordName(docRef),
                Hanzi = hanzi,
                Pronunciations = { recommendedProns },
                Explanation = { explanations },
                Snippet = zhConverter.tH(GetSnippet(maybeYngdiengDocument, extensions)),
                AudioCards = { audioCards },
                WordLists = {
                    wordLists
                }
            };
        }

        private static async Task<string> GetHanzi(AdminContext dbContext, YngdiengDocument? maybeYngdiengDocument, int? wordId)
        {
            var hanziFromIndex = maybeYngdiengDocument == null ? null : HanziUtils.HanziToString(maybeYngdiengDocument.HanziCanonical);
            if (!string.IsNullOrEmpty(hanziFromIndex))
            {
                return hanziFromIndex;
            }
            var maybeWordFromDb = await dbContext.Words.SingleOrDefaultAsync(w => w.WordId == wordId);
            return maybeWordFromDb != null ? maybeWordFromDb.Hanzi : string.Empty;
        }

        private static async Task<IEnumerable<Word.Types.AudioCard>> GetAudioCards(
            AdminContext dbContext, IEnumerable<Word.Types.Pronunciation> prons,
            int? maybeWordId)
        {
            var output = new List<Word.Types.AudioCard>();
            output.AddRange(prons.Select(p =>
                new Word.Types.AudioCard()
                {
                    Pronunciation = p.Pronunciation_,
                    HintPrimary = p.DisplayName,
                    Audio = p.Audio
                }));

            if (!maybeWordId.HasValue)
            {
                return output.ToImmutableArray();
            }

            var audioClips = await Queries.QueryAudioClipsByWordId(dbContext, maybeWordId.Value).ToListAsync();
            output.AddRange(audioClips.Select(Renderers.ToAudioCard));

            return output.ToImmutableArray();
        }

        private static RichTextNode[] GetExplanations(
            ZhConverter zhConverter,
            string hanzi,
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Extension> extensions
        )
        {
            var output = new List<RichTextNode>();
            var fengDocs = maybeYngdiengDocument?.Sources
                .Where(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng).Select(s => s.Feng)
                           ?? Enumerable.Empty<FengDocument>();

            var fengRenderer = new FengRichTextRenderer(zhConverter);
            output.AddRange(fengDocs.Select(f => fengRenderer.ToRichTextNode(f)));
            var hDoc = maybeYngdiengDocument?.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd)?.CiklinDfd ?? null;

            var histRenderer = new HistoricalRichTextRenderer(zhConverter);
            if (hDoc != null)
            {
                output.Add(histRenderer.ToRichTextNode(hDoc));
            }

            var extRenderer = new ExtensionRichTextRenderer(zhConverter);
            output.AddRange(extensions.Select(e => extRenderer.ToRichTextNode(hanzi, e.Explanation, e.Source, e.Contributors)));
            if (extensions.Count() == 0)
            {
                var contribFromIndex = maybeYngdiengDocument?.Sources
                    .Where(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Contrib)
                    .Select(s => s.Contrib) ?? Enumerable.Empty<ContribDocument>();
                var contribRenderer = new ContribRichTextRenderer(zhConverter);
                output.AddRange(contribFromIndex.Select(c => contribRenderer.ToRichTextNode(c)));
            }

            return output.ToArray();
        }

        public static string GetSnippet(
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Extension> extensions
        )
        {
            var fengExplation = maybeYngdiengDocument?.Sources
               .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng)?.Feng.ExplanationTrad;
            if (fengExplation != null)
            {
                return fengExplation.Truncate(100);
            }
            var contribExplanation = maybeYngdiengDocument?.Sources
                        .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Contrib)
                        ?.Contrib.ExplanationRaw; //TODO:fix. explanation flattened.
            if (contribExplanation != null)
            {
                return contribExplanation.Truncate(100);
            }
            var extensionExplanation = extensions.FirstOrDefault();
            if (extensionExplanation != null)
            {
                return extensionExplanation.Explanation.Truncate(100);
            }
            var cikExplanation = maybeYngdiengDocument?.Sources
                        .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd)
                        ?.CiklinDfd?.CiklinSource?.ExplanationCik;
            if (!string.IsNullOrEmpty(cikExplanation))
            {
                return cikExplanation.Truncate(100);
            }
            var lingExplanation = maybeYngdiengDocument?.Sources
                        .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd)
                        ?.CiklinDfd?.CiklinSource?.ExplanationLing;
            if (!string.IsNullOrEmpty(lingExplanation))
            {
                return lingExplanation.Truncate(100);
            }
            return string.Empty;
        }

    }
}
