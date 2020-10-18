using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using Yngdieng.Backend.Db;
using static Yngdieng.Backend.Services.Admin.EnumConversions;
namespace Yngdieng.Backend.Services.Admin
{
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
    {


        public async override Task<Yngdieng.Admin.V1.Protos.Pron> UpdatePron(UpdatePronRequest request,
                                                   ServerCallContext context)
        {
            if (request.Pron == null)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "pron must be set"));
            }
            if (string.IsNullOrEmpty(request.Pron.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "pron.name must not be empty"));
            }
            var pronRef = ResourceNames.ToPronRef(request.Pron.Name);
            Db.Pron pron;
            try
            {
                pron = await _dbContext.Prons.Where(p => p.WordId == pronRef.WordId && p.PronId == pronRef.PronId)
                .SingleAsync();
            }
            catch (Exception e)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Pron {request.Pron.Name} does not exist", e));
            }
            if (request.UpdateMask.Paths.Contains("pronunciation"))
            {
                pron.Pronunciation = request.Pron.Pronunciation;
            }
            if (request.UpdateMask.Paths.Contains("weight"))
            {
                pron.Weight = request.Pron.Weight;
            }
            if (request.UpdateMask.Paths.Contains("sandhi_category"))
            {
                pron.SandhiCategory = ProtoSCToDbSC[request.Pron.SandhiCategory];
            }
            if (request.UpdateMask.Paths.Contains("variant"))
            {
                pron.Variant = ProtoVariantToDbVariant[request.Pron.Variant];
            }
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                throw new RpcException(new Status(StatusCode.FailedPrecondition, "database error", e));
            }
            return Renderers.ToPron(pron);
        }
    }
}
