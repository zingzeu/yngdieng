using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Yngdieng.Common;
using FrontendProtos = Yngdieng.Frontend.V3.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Frontend
{

    public partial class FrontendService : FrontendProtos.FrontendService.FrontendServiceBase
    {

        private const int MaxPageSize = 50;
        private const int DefaultPageSize = 15;

        public async override Task<FrontendProtos.ListWordListWordsResponse> ListWordListWords(
            FrontendProtos.ListWordListWordsRequest request,
            ServerCallContext context)
        {
            if (string.IsNullOrEmpty(request.Parent))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "parent must not be empty"));
            }
            var wordListId = ResourceNames.ToWordListId(request.Parent);

            var pageSize = Math.Min(MaxPageSize, request.PageSize > 0 ? request.PageSize : DefaultPageSize);
            var offset = ParsePageToken(request.PageToken);
            var wordIds = await _dbContext.WordListWords
                .Where(w => w.WordListId == wordListId)
                .OrderBy(w => w.Ordering)
                .Select(w => w.WordId)
                .Skip(offset)
                .Take(pageSize)
                .ToListAsync();
            var words = new List<FrontendProtos.Word>();
            var userPreference = UserPreferences.FromContext(context);
            var zhConverter = new OpenCcZhConverter(_openCc, userPreference.ZhConversionPreference);
            foreach (var wordId in wordIds)
            {
                words.Add(await Words.GetWord(_indexHolder, _dbContext, zhConverter, ResourceNames.ToDocRef(wordId), Words.Mode.Snippet));
            }
            return new FrontendProtos.ListWordListWordsResponse
            {
                Words = { words },
                NextPageToken = (offset + words.Count).ToString()
            };
        }

        private static int ParsePageToken(string pageToken)
        {
            int offset = 0;
            int.TryParse(pageToken, out offset);
            return offset;
        }
    }
}
