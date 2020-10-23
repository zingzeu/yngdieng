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
            var docRef = DocRefs.Decode(docId);
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
            var audioClips = await _dbContext.WordAudioClips.Where(a => a.WordId == maybeWordId).ToListAsync();

            return new Yngdieng.Frontend.V1.Protos.Word
            {
                Name = docId
            };
        }

        private static Yngdieng.Frontend.V1.Protos.Word.Types.Pronunciation[] GetPronunciations(
            YngdiengDocument maybeYngdiengDocument

            )
        {
            return null;
        }
    }
}
