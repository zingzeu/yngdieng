using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Microsoft.Extensions.Logging;
using Yngdieng.Common;
using Yngdieng.Protos;
using Yngdieng.Search.Common;
using LuceneQuery = Lucene.Net.Search.Query;

namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<SearchV2Response> SearchV2(SearchV2Request request,
                                                        ServerCallContext context)
        {
            var query = QueryParser.Parse(request.Query);
            var resultCards = new List<SearchV2Response.Types.SearchCard>();
            resultCards.Add(GenericMessageCard("你正在試用榕典搜索V2。如遇問題，請將截圖和網址發送到 radium@mindong.asia。"));

            switch (query.QueryCase)
            {
                case Yngdieng.Protos.Query.QueryOneofCase.HanziQuery:
                    resultCards.AddRange(HandleHanziQuery(query.HanziQuery));
                    break;
                case Yngdieng.Protos.Query.QueryOneofCase.YngpingTonePatternQuery:
                    resultCards.AddRange(HandleYngpingTonePatternQuery(query.YngpingTonePatternQuery));
                    break;
                case Yngdieng.Protos.Query.QueryOneofCase.FuzzyPronQuery:
                    resultCards.AddRange(HandleFuzzyYngpingQuery(query.FuzzyPronQuery));
                    break;
                default:
                    _logger.LogError($"Unsupported query type: {query.QueryCase}");
                    resultCards.Add(GenericMessageCard($"不支持的搜索類型： {query.QueryCase}"));
                    break;
            }
            return Task.FromResult(new SearchV2Response
            {
                ResultCards = {
                                resultCards,
                                EndOfResultsCard()
                               },
                NextPageToken = ""
            });
        }

        private IEnumerable<SearchV2Response.Types.SearchCard> HandleFuzzyYngpingQuery(string queryText)
        {
            var queryParser = new MultiFieldQueryParser(LuceneUtils.AppLuceneVersion,
            new string[] { LuceneUtils.Fields.Yngping },
                        LuceneUtils.GetAnalyzer(),
                        new Dictionary<string, float>{
                {LuceneUtils.Fields.Yngping, 100},
                        });
            var query = queryParser.Parse(queryText);
            var searcher = this._indexHolder.LuceneIndexSearcher;
            var results = searcher.Search(query, 100);
            return RenderDocs(results.ScoreDocs);
        }

        private IEnumerable<SearchV2Response.Types.SearchCard> HandleYngpingTonePatternQuery(string queryText)
        {
            var query = new WildcardQuery(new Lucene.Net.Index.Term(LuceneUtils.Fields.YngpingSandhiTonePattern, queryText));
            var searcher = this._indexHolder.LuceneIndexSearcher;
            var results = searcher.Search(query, 100);
            return RenderDocs(results.ScoreDocs);
        }

        private IEnumerable<SearchV2Response.Types.SearchCard> HandleHanziQuery(string queryText)
        {
            var queryParser = new MultiFieldQueryParser(LuceneUtils.AppLuceneVersion,
            new string[] { LuceneUtils.Fields.Hanzi, LuceneUtils.Fields.Explanation },
                        LuceneUtils.GetAnalyzer(),
                        new Dictionary<string, float>{
                {LuceneUtils.Fields.Hanzi, 100},
                {LuceneUtils.Fields.Explanation, 1}
                        });
            var query = queryParser.Parse(queryText);
            var searcher = this._indexHolder.LuceneIndexSearcher;
            var results = searcher.Search(query, 100);
            return RenderDocs(results.ScoreDocs);
        }

        private static string FindBestExplanation(YngdiengDocument ydDoc)
        {
            var fengExplation = ydDoc.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng)
                ?.Feng.ExplanationTrad;
            if (fengExplation != null)
            {
                return fengExplation.Truncate(100);
            }
            var contribExplanation = ydDoc.Sources
                        .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Contrib)
                        ?.Contrib.ExplanationRaw; //TODO:fix. explanation flattened.
            if (contribExplanation != null)
            {
                return contribExplanation.Truncate(100);
            }
            return string.Empty;
        }

        private IEnumerable<SearchV2Response.Types.SearchCard> RenderDocs(ScoreDoc[] scoreDocs)
        {
            var searcher = this._indexHolder.LuceneIndexSearcher;

            return scoreDocs.Select(sd =>
           {
               var docId = searcher.Doc(sd.Doc).GetField(LuceneUtils.Fields.DocId).GetStringValue();
               var ydDoc = _indexHolder.GetIndex().YngdiengDocuments.Single(y => y.DocId == docId);

               return new SearchV2Response.Types.SearchCard
               {
                   Word = new SearchV2Response.Types.SearchCard.Types.WordCard
                   {
                       Id = docId,
                       Yngping = RichTextUtil.FromString(ydDoc.YngpingSandhi.OrElse(ydDoc.YngpingUnderlying)),
                       Hanzi = RichTextUtil.FromString(HanziUtils.HanziToString(ydDoc.HanziCanonical)),
                       Details = RichTextUtil.FromString(FindBestExplanation(ydDoc)),
                       Score = sd.Score
                   }
               };
           });
        }

        private static SearchV2Response.Types.SearchCard GenericMessageCard(string message)
        {
            return new SearchV2Response.Types.SearchCard
            {
                GenericMessage = new SearchV2Response.Types.SearchCard.Types
                                                          .GenericMessageCard()
                {
                    Message = RichTextUtil.FromString(message)
                }
            };
        }
        private static SearchV2Response.Types.SearchCard EndOfResultsCard()
        {
            return new SearchV2Response.Types.SearchCard
            {
                EndOfResults = new SearchV2Response.Types.SearchCard.Types
                                                          .EndOfResultsCard()
            };
        }
    }

}
