using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using ZingzeuOrg.Yngdieng.Web.Db;

namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
    {
        public async override Task<Yngdieng.Admin.V1.Protos.Word> CreateWord(CreateWordRequest request,
                                                   ServerCallContext context)
        {

            int presetWordId = -1;
            if (!string.IsNullOrEmpty(request.WordId))
            {
                try
                {
                    presetWordId = int.Parse(request.WordId, System.Globalization.NumberStyles.HexNumber);
                }
                catch (ArgumentException e)
                {
                    throw new RpcException(new Status(StatusCode.InvalidArgument, "Invalid word_id", e));
                }
                catch (FormatException e)
                {
                    throw new RpcException(new Status(StatusCode.InvalidArgument, "Invalid word_id", e));
                }
            }
            if (request.Word == null)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "word must be set"));
            }
            if (string.IsNullOrEmpty(request.Word.Hanzi))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "word.hanzi must not be empty"));
            }
            if (request.Word.Extensions.Count > 0)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "word.extensions must not be set on create"));
            }
            if (request.Word.Prons.Count > 0)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "word.prons must not be set on create"));
            }
            var newWord = new Db.Word
            {
                Hanzi = request.Word.Hanzi,
                HanziAlternatives = new List<string>(request.Word.HanziAlternatives),
                MandarinWords = new List<string>(request.Word.MandarinWords),
                Gloss = string.IsNullOrEmpty(request.Word.Gloss) ? null : request.Word.Gloss,
            };
            if (presetWordId > 0)
            {
                newWord.WordId = presetWordId;
            }

            _dbContext.Words.Add(newWord);
            try
            {
                await _dbContext.SaveChangesAsync();

            }
            catch (DbUpdateException e)
            {
                throw new RpcException(new Status(StatusCode.FailedPrecondition, "word id already exists", e));
            }
            return Renderers.ToWord(newWord);
        }
    }
}
