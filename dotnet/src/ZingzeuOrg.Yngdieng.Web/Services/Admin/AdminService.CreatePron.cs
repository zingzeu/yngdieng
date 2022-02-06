using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using ZingzeuOrg.Yngdieng.Web.Db;
using static ZingzeuOrg.Yngdieng.Web.Services.Admin.EnumConversions;
using AdminProtos = Yngdieng.Admin.V1.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{
    public partial class AdminService : AdminProtos.AdminService.AdminServiceBase
    {


        public async override Task<AdminProtos.Pron> CreatePron(CreatePronRequest request,
                                                   ServerCallContext context)
        {
            if (request.Pron == null)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "pron must be set"));
            }
            if (string.IsNullOrEmpty(request.Pron.Pronunciation))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "pron.pronunciation must not be empty"));
            }
            var wordRef = ResourceNames.ToWordRef(request.Parent);
            if (!await _dbContext.Words.Where(w => w.WordId == wordRef.WordId).AnyAsync())
            {
                throw new RpcException(new Status(StatusCode.FailedPrecondition, $"Word {request.Parent} does not exist"));
            }
            var newPron = new Db.Pron
            {
                WordId = wordRef.WordId,
                Pronunciation = request.Pron.Pronunciation,
                Weight = request.Pron.Weight,
                SandhiCategory = ProtoSCToDbSC[request.Pron.SandhiCategory],
                Variant = ProtoVariantToDbVariant[request.Pron.Variant],
            };

            _dbContext.Prons.Add(newPron);
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                throw new RpcException(new Status(StatusCode.FailedPrecondition, "database error", e));
            }
            return Renderers.ToPron(newPron);
        }
    }
}
