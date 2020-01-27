using System;
using System.Threading.Tasks;
using Yngdieng.Protos;
using static Yngdieng.Protos.Query.Types;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {

    public override Task<FengDocument> GetFengDocument(GetFengDocumentRequest request, ServerCallContext context)
    {
      return Task.FromResult(_indexHolder.GetIndex().FengDocuments.Where(f => f.Id == request.Id).FirstOrDefault());
    }
  }


}
