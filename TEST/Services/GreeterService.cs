using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Yngdieng.Protos;

namespace TEST
{
   public class YngdiengServiceImpl:YngdiengService.YngdiengServiceBase {
        public override Task<SearchResponse> GetSearch(SearchRequest request, ServerCallContext context) {
            Console.WriteLine("A search request"); 
            return Task.FromResult(new SearchResponse());
        }
    }
}
