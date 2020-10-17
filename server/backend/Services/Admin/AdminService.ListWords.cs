using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using Yngdieng.Backend.Db;

namespace Yngdieng.Backend.Services.Admin
{
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
    {
        public async override Task<ListWordsResponse> ListWords(ListWordsRequest request,
                                                   ServerCallContext context)
        {
            var count = await _dbContext.Words.CountAsync();

            var result = _dbContext.WordsWithPronIds.FromSqlRaw(@"
                SELECT words.*,  ARRAY(
	                SELECT pron_id FROM prons WHERE prons.word_id = words.word_id
                ) as pron_ids FROM words
                ORDER BY words.word_id ASC;")
            .Select(x => Renderers.ToWord(x));
            return new ListWordsResponse
            {
                TotalSize = count,
                Words = { result }
            };
        }
    }
}
