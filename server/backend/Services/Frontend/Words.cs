using System.Collections.Generic;
using System.Collections.Immutable;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.EntityFrameworkCore;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
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

        public static async Task<Word>
            GetWord(IIndexHolder _indexHolder, AdminContext _dbContext, DocRef docRef, Mode mode = Mode.Full)
        {
            var maybeYngdiengDocument = _indexHolder.GetIndex().YngdiengDocuments
                .SingleOrDefault(yDoc => yDoc.DocId == DocRefs.Encode(docRef));
            var maybeWordId = string.IsNullOrEmpty(docRef.ZingzeuId)
                ? (int?)null : int.Parse(docRef.ZingzeuId, NumberStyles.HexNumber);
            var maybeWord = maybeWordId == null ? null : await _dbContext.Words.Where(w => w.WordId == maybeWordId).SingleOrDefaultAsync();
            if (maybeYngdiengDocument == null && maybeWord == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Not found."));
            }
            var extensions = await _dbContext.Extensions.Where(e => e.WordId == maybeWordId).ToListAsync();
            var prons = await _dbContext.Prons.Where(p => p.WordId == maybeWordId).ToListAsync();
            var recommendedProns = GetRecommendedPronunciations(maybeYngdiengDocument, prons);
            var explanations = mode == Mode.Snippet
                ? Enumerable.Empty<RichTextNode>()
                : GetExplanations(maybeYngdiengDocument, extensions);
            var audioCards = mode == Mode.Snippet ? Enumerable.Empty<Word.Types.AudioCard>()
                : await GetAudioCards(_dbContext, recommendedProns, maybeWordId);
            var wordLists = mode == Mode.Full && maybeWordId.HasValue
                ? await Queries.QueryWordListsByWordId(_dbContext, maybeWordId.Value).Select(wl => Renderers.ToWordList(wl)).ToListAsync()
                : Enumerable.Empty<WordList>();
            return new Word
            {
                Name = ResourceNames.ToWordName(docRef),
                Hanzi = await GetHanzi(_dbContext, maybeYngdiengDocument, maybeWordId),
                Pronunciations = { recommendedProns },
                Explanation = { explanations },
                Snippet = GetSnippet(maybeYngdiengDocument, extensions),
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

        private static Word.Types.Pronunciation[] GetRecommendedPronunciations(
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Pron> pronsFromDb
            )
        {
            var bengziFromIndex = maybeYngdiengDocument?.YngpingUnderlying;
            var sandhiFromIndex = maybeYngdiengDocument?.YngpingSandhi;
            var bengziFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.BENGZI)?.Pronunciation;
            var sandhiFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.SANDHI).Pronunciation;
            var bengzi = bengziFromIndex?.OrElse(bengziFromDb);
            var sandhi = sandhiFromIndex?.OrElse(sandhiFromDb);

            var differentSandhiAndUnderlying = !string.IsNullOrWhiteSpace(bengzi)
                                               && !string.IsNullOrWhiteSpace(sandhi)
                                               && bengzi != sandhi
                                               && bengzi.Split().Count() > 1;
            if (differentSandhiAndUnderlying)
            {
                return new[] {
                        AudioResources.PronunciationWithTts("市区单字", bengzi),
                        AudioResources.PronunciationWithTts("市区连读", sandhi)
                    };
            }
            var onlyPron = sandhi?.OrElse(bengzi) ?? "";
            return new[] {AudioResources.PronunciationWithTts("福州市区", onlyPron)
                    };
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
              YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Extension> extensions
        )
        {
            var output = new List<RichTextNode>();
            var fengDocs = maybeYngdiengDocument?.Sources
                .Where(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng).Select(s => s.Feng)
                           ?? Enumerable.Empty<FengDocument>();
            output.AddRange(fengDocs.Select(Renderers.ToRichTextNode));
            var hDoc = maybeYngdiengDocument?.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd)?.CiklinDfd ?? null;
            if (hDoc != null)
            {
                output.Add(Renderers.ToRichTextNode(hDoc));
            }
            // TODO: add word hanzi to extensions
            output.AddRange(extensions.Select(e => Renderers.ToRichTextNode("", e)));
            if (extensions.Count() == 0)
            {
                var contribFromIndex = maybeYngdiengDocument?.Sources
                    .Where(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Contrib)
                    .Select(s => s.Contrib) ?? Enumerable.Empty<ContribDocument>(); ;
                output.AddRange(contribFromIndex.Select(Renderers.ToRichTextNode));
            }

            return output.ToArray();
        }

        private static string GetSnippet(
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
            return extensionExplanation != null ? extensionExplanation.Explanation.Truncate(100) : string.Empty;
        }

    }
}
