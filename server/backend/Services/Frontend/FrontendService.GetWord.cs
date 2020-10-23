using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V1.Protos;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public partial class FrontendService : Yngdieng.Frontend.V1.Protos.FrontendService.FrontendServiceBase
    {
        public async override Task<Yngdieng.Frontend.V1.Protos.Word> GetWord(GetWordRequest request,
                                                   ServerCallContext context)
        {

            if (string.IsNullOrEmpty(request.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "name must not be empty"));
            }
            var docId = ResourceNames.ToDocId(request.Name);


            if (_indexHolder.GetIndex().DocIdRedirections.ContainsKey(docId))
            {
                var redirectionTarget = _indexHolder.GetIndex().DocIdRedirections[docId];
                _logger.LogInformation($"DocId Redirection: {docId} -> {redirectionTarget}");
                docId = redirectionTarget;
            }
            DocRef docRef;
            try
            {
                docRef = DocRefs.Decode(docId);
            }
            catch (Exception e)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, $"{request.Name} is not a valid name.", e));
            }
            var maybeYngdiengDocument = _indexHolder.GetIndex().YngdiengDocuments.Where(yDoc => yDoc.DocId == docId).SingleOrDefault();
            int? maybeWordId = string.IsNullOrEmpty(docRef.ZingzeuId)
                ? (int?)null : int.Parse(docRef.ZingzeuId, System.Globalization.NumberStyles.HexNumber);
            var maybeWord = maybeWordId == null ? null : await _dbContext.Words.Where(w => w.WordId == maybeWordId).SingleOrDefaultAsync();
            if (maybeYngdiengDocument == null && maybeWord == null)
            {
                _logger.LogWarning($"{docId} is not present in YngdiengIndex nor DB.");
                throw new RpcException(new Status(StatusCode.NotFound, $"{request.Name} is not found."));
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
            return new Yngdieng.Frontend.V1.Protos.Word
            {
                Name = docId,
                Pronunciations = { GetRecommendedPronunciations(maybeYngdiengDocument, prons) },
                Explanation = { GetExplanations(maybeYngdiengDocument, extensions) }
            };
        }

        private static Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation[] GetRecommendedPronunciations(
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

                    return new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation[] {
                        new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation() {
                            DisplayName = "市区单字",
                            Pronunciation_ = maybeYngdiengDocument.YngpingUnderlying,
                            Audio =  AudioResourceWithTtsUrls(maybeYngdiengDocument.YngpingUnderlying)
                        },
                        new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation() {
                           DisplayName = "市区连读",
                            Pronunciation_ = maybeYngdiengDocument.YngpingSandhi,
                            Audio = AudioResourceWithTtsUrls(maybeYngdiengDocument.YngpingSandhi)
                        },
                    };
                }
                var onlyPron = string.IsNullOrWhiteSpace(maybeYngdiengDocument.YngpingUnderlying)
                    ? maybeYngdiengDocument.YngpingSandhi
                    : maybeYngdiengDocument.YngpingUnderlying;
                return new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation[] {
                        new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation() {
                            DisplayName = "福州市区",
                            Pronunciation_ = onlyPron,
                            Audio =  AudioResourceWithTtsUrls(onlyPron)
                        },

                    };
            }

            var bengziFromDb = pronsFromDb.Where(p => p.SandhiCategory == SandhiCategory.BENGZI).SingleOrDefault();
            var sandhiFromDb = pronsFromDb.Where(p => p.SandhiCategory == SandhiCategory.SANDHI).SingleOrDefault();
            var output = new List<Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation>();
            if (bengziFromDb != null)
            {
                output.Add(new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation()
                {
                    DisplayName = "市区单字",
                    Pronunciation_ = bengziFromDb.Pronunciation,
                    Audio = AudioResourceWithTtsUrls(bengziFromDb.Pronunciation)
                });
            }
            if (sandhiFromDb != null)
            {
                output.Add(new Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation()
                {
                    DisplayName = "市区连读",
                    Pronunciation_ = sandhiFromDb.Pronunciation,
                    Audio = AudioResourceWithTtsUrls(sandhiFromDb.Pronunciation)
                });
            }
            return output.ToArray();
        }

        private static Yngdieng.Frontend.V1.Protos.RichTextNode[] GetExplanations(
              YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Db.Extension> extensions

        )
        {
            var output = new List<Yngdieng.Frontend.V1.Protos.RichTextNode>() { };
            var hDoc = maybeYngdiengDocument.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.CiklinDfd).CiklinDfd ?? null;
            if (hDoc != null)
            {
                output.Add(Renderers.ToRichTextNode(hDoc));
            }
            return output.ToArray();
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
