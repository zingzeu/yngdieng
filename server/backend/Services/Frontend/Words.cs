using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Words
    {
        public enum Mode
        {
            Full,
            Snippet
        }

        public static async Task<Yngdieng.Frontend.V3.Protos.Word> GetWord(IIndexHolder _indexHolder, AdminContext _dbContext, DocRef docRef, Mode mode = Mode.Full)
        {
            var maybeYngdiengDocument = _indexHolder.GetIndex().YngdiengDocuments.Where(yDoc => yDoc.DocId == DocRefs.Encode(docRef)).SingleOrDefault();
            int? maybeWordId = string.IsNullOrEmpty(docRef.ZingzeuId)
                ? (int?)null : int.Parse(docRef.ZingzeuId, System.Globalization.NumberStyles.HexNumber);
            var maybeWord = maybeWordId == null ? null : await _dbContext.Words.Where(w => w.WordId == maybeWordId).SingleOrDefaultAsync();
            if (maybeYngdiengDocument == null && maybeWord == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Not found."));
            }

            var extensions = await _dbContext.Extensions.Where(e => e.WordId == maybeWordId).ToListAsync();
            var prons = await _dbContext.Prons.Where(p => p.WordId == maybeWordId).ToListAsync();
            var audioClips = maybeWordId == null ? new List<Db.AudioClipsByWordId>() : await _dbContext.AudioClipsByWordId
                .FromSqlRaw(@"
                                select 
                                word_audio_clips.word_id,
                                word_audio_clips.audio_clip_id,
                                audio_clips.pronunciation,
                                audio_clips.blob_location,
                                audio_clips.mime_type,
                                speakers.display_name as speaker_display_name,
                                speakers.location as speaker_location,
                                CAST(date_part('year', CURRENT_DATE) - speakers.year_of_birth as integer) as speaker_age,
                                speakers.gender as speaker_gender
                from word_audio_clips 
                join audio_clips on audio_clips.audio_clip_id = word_audio_clips.audio_clip_id
                join speakers on speakers.speaker_id = audio_clips.speaker_id
                where word_id ={0};
                ", maybeWordId).ToListAsync();
            var explanations = mode == Mode.Snippet ? new Yngdieng.Frontend.V3.Protos.RichTextNode[] { } : GetExplanations(maybeYngdiengDocument, extensions);
            return new Yngdieng.Frontend.V3.Protos.Word
            {
                Name = ResourceNames.ToWordName(docRef),
                Pronunciations = { GetRecommendedPronunciations(maybeYngdiengDocument, prons) },
                Explanation = { explanations },
                Snippet = GetSnippet(maybeYngdiengDocument, extensions)
            };
        }

        private static Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation[] GetRecommendedPronunciations(
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Db.Pron> pronsFromDb
            )
        {
            if (maybeYngdiengDocument != null)
            {
                if (!string.IsNullOrWhiteSpace(maybeYngdiengDocument.YngpingUnderlying)
                && !string.IsNullOrWhiteSpace(maybeYngdiengDocument.YngpingSandhi)
                && maybeYngdiengDocument.YngpingSandhi != maybeYngdiengDocument.YngpingUnderlying
                && maybeYngdiengDocument.YngpingSandhi.Split().Count() > 1)
                {

                    return new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation[] {
                        new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation() {
                            DisplayName = "市区单字",
                            Pronunciation_ = maybeYngdiengDocument.YngpingUnderlying,
                            Audio =  AudioResourceWithTtsUrls(maybeYngdiengDocument.YngpingUnderlying)
                        },
                        new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation() {
                           DisplayName = "市区连读",
                            Pronunciation_ = maybeYngdiengDocument.YngpingSandhi,
                            Audio = AudioResourceWithTtsUrls(maybeYngdiengDocument.YngpingSandhi)
                        },
                    };
                }
                var onlyPron = string.IsNullOrWhiteSpace(maybeYngdiengDocument.YngpingUnderlying)
                    ? maybeYngdiengDocument.YngpingSandhi
                    : maybeYngdiengDocument.YngpingUnderlying;
                return new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation[] {
                        new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation() {
                            DisplayName = "福州市区",
                            Pronunciation_ = onlyPron,
                            Audio =  AudioResourceWithTtsUrls(onlyPron)
                        },

                    };
            }

            var bengziFromDb = pronsFromDb.Where(p => p.SandhiCategory == SandhiCategory.BENGZI).FirstOrDefault();
            var sandhiFromDb = pronsFromDb.Where(p => p.SandhiCategory == SandhiCategory.SANDHI).FirstOrDefault();
            var output = new List<Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation>();
            if (bengziFromDb != null)
            {
                output.Add(new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation()
                {
                    DisplayName = "市区单字",
                    Pronunciation_ = bengziFromDb.Pronunciation,
                    Audio = AudioResourceWithTtsUrls(bengziFromDb.Pronunciation)
                });
            }
            if (sandhiFromDb != null)
            {
                output.Add(new Yngdieng.Frontend.V3.Protos.Word.Types.Pronunciation()
                {
                    DisplayName = "市区连读",
                    Pronunciation_ = sandhiFromDb.Pronunciation,
                    Audio = AudioResourceWithTtsUrls(sandhiFromDb.Pronunciation)
                });
            }
            return output.ToArray();
        }

        private static Yngdieng.Frontend.V3.Protos.RichTextNode[] GetExplanations(
              YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Db.Extension> extensions

        )
        {
            var output = new List<Yngdieng.Frontend.V3.Protos.RichTextNode>() { };
            var fengDoc = maybeYngdiengDocument?.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng)?.Feng ?? null;
            if (fengDoc != null)
            {
                output.Add(Renderers.ToRichTextNode(fengDoc));
            }
            var hDoc = maybeYngdiengDocument?.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd)?.CiklinDfd ?? null;
            if (hDoc != null)
            {
                output.Add(Renderers.ToRichTextNode(hDoc));
            }
            output.AddRange(extensions.Select(e => Renderers.ToRichTextNode("", e)));//TODO word hanzi; remove dups
            return output.ToArray();
        }

        private static string GetSnippet(
             YngdiengDocument? maybeYngdiengDocument,
           IEnumerable<Db.Extension> extensions

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
                return extensionExplanation.Explanation.Truncate(100); // todo
            }
            return string.Empty;
        }

        private static AudioResource AudioResourceWithTtsUrls(string yngping)
        {
            return new AudioResource()
            {
                RemoteUrls = new AudioResource.Types.RemoteUrls()
                {
                    RemoteUrls_ = {
                                        "tts "+yngping
                                    }
                }
            };
        }
    }
}
