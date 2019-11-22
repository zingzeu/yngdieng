using System;
using Yngdieng.Protos;
using Grpc.Core;
using System.Threading.Tasks;

namespace test_dotnet {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("It works");
            var a = new Document {
                Tone = Tone.DownLevel,
                Initial = Initial.B
            };
            Console.WriteLine(a);
        }
    }

    public class YngdiengServiceImpl:YngdiengService.YngdiengServiceBase {
        public override Task<SearchResponse> GetSearch(SearchRequest request, ServerCallContext context) {
            Console.WriteLine("A search request"); 
            return Task.FromResult(new SearchResponse());
        }
    }
}