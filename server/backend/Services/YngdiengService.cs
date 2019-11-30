using System;
using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;

namespace Yngdieng.Backend.Services {
public class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {
        public override Task<SearchResponse> GetSearch(SearchRequest request, ServerCallContext context)
        {
            Console.WriteLine("A search request");
            return Task.FromResult(new SearchResponse());
        }
    }
}