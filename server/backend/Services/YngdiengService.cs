using System;
using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Linq;
namespace Yngdieng.Backend.Services
{
    public class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {
        private readonly ILogger<YngdiengService> _logger;
        private readonly IIndexHolder _indexHolder;

        public YngdiengService(ILogger<YngdiengService> logger, IIndexHolder indexHolder)
        {
            _logger = logger;
            _indexHolder = indexHolder;
        }
        public override Task<SearchResponse> GetSearch(SearchRequest request, ServerCallContext context)
        {
            _logger.LogInformation("A search request" + request.ToString());
            switch (request.Query.QueryCase)
            {
                case Query.QueryOneofCase.PhonologyQuery:
                    {
                        Initial initial = request.Query.PhonologyQuery.Initial;
                        Final final = request.Query.PhonologyQuery.Final;
                        Tone tone = request.Query.PhonologyQuery.Tone;
                        if (initial == Initial.Unspecified &&
                            final == Final.Unspecified &&
                            tone == Tone.Unspecified)
                        {
                            throw new Exception("Cannot all be unspecified");
                        }
                        var documents = _indexHolder.GetIndex().Documents.Where(_ => true);
                        if (initial != Initial.Unspecified)
                        {
                            documents = documents.Where(d => d.Initial == initial);
                        }
                        if (final != Final.Unspecified)
                        {
                            documents = documents.Where(d => d.Final == final);
                        }
                        if (tone != Tone.Unspecified)
                        {
                            documents = documents.Where(d => d.Tone == tone);
                        }
                        var matchedDocuments = documents.OrderBy(d =>
                        {
                            return GetHanzi(d.HanziCanonical);
                        }).ThenBy(d => d.Final)
                                .ThenBy(d => d.Initial)
                                .ThenBy(d => d.Tone)
                                .ToList();
                        var response = new SearchResponse();
                        response.Documents.Add(matchedDocuments);
                        return Task.FromResult(response);
                    }
                case Query.QueryOneofCase.HanziQuery:
                    {
                        string query = request.Query.HanziQuery;
                        if (query == null)
                        {
                            throw new Exception("Cannot all be null");
                        }
                        var matchedDocuments = _indexHolder.GetIndex().Documents
                            .Where(d =>
                                GetHanzi(d.HanziCanonical) == query
                                || d.HanziAlternatives.Where(
                                    r => GetHanzi(r) == query).Count() > 0
                            )
                            .OrderBy(d => GetHanzi(d.HanziCanonical))
                                .ThenBy(d => d.Final)
                                .ThenBy(d => d.Initial)
                                .ThenBy(d => d.Tone)
                            .ToList();
                        var response = new SearchResponse();
                        response.Documents.Add(matchedDocuments);
                        Console.WriteLine(response);
                        return Task.FromResult(response);
                    }
                default:
                    throw new Exception("Not implemented");
            }
        }

        public static string GetHanzi(Hanzi h)
        {
            return h.HanziCase == Hanzi.HanziOneofCase.Regular
                        ? h.Regular
                        : h.Ids;
        }
        public override Task<GetDocumentResponse> GetDocument(GetDocumentRequest request, ServerCallContext context)
        {
            _logger.LogInformation("GetDocumentRequest: " + request.ToString());
            switch (request.DocumentIdCase)
            {
                case GetDocumentRequest.DocumentIdOneofCase.CiklinId:
                    {
                        var ciklinId = request.CiklinId;
                        var matchedDocument = _indexHolder
                            .GetIndex()
                            .Documents
                            .Where(document =>
                                (document as Document).CiklinId == ciklinId)
                            .FirstOrDefault();
                        return Task.FromResult(new GetDocumentResponse()
                        {
                            Document = matchedDocument
                        });
                    }
                case GetDocumentRequest.DocumentIdOneofCase.DfdId:
                    {
                        var dfdId = request.DfdId;
                        var matchedDocument = _indexHolder.GetIndex().Documents.Where(document => (document as Document).DfdId == dfdId).FirstOrDefault();
                        return Task.FromResult(new GetDocumentResponse()
                        {
                            Document = matchedDocument
                        });
                    }
                default:
                    throw new Exception("Bad request");
            }
            return Task.FromResult(new GetDocumentResponse());
        }
    }
}