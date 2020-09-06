using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
using Microsoft.Extensions.Logging;
using LuceneQuery = Lucene.Net.Search.Query;
using Lucene.Net.Search;
using Lucene.Net.QueryParsers.Classic;
using Yngdieng.Search.Common;
using Yngdieng.Common;
using System.Collections.Generic;
using System;

namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<SearchV2Response> SearchV2(SearchV2Request request,
                                                        ServerCallContext context)
        {
            var query = QueryParser.Parse(request.Query);
            switch (query.QueryCase)
            {

                case Yngdieng.Protos.Query.QueryOneofCase.HanziQuery:
                    {
                        return Task.FromResult(new SearchV2Response
                        {
                            ResultCards = {HandleHanziQuery(query.HanziQuery),
                               EndOfResultsCard()
                               },
                            NextPageToken = ""
                        });
                    }
                case Yngdieng.Protos.Query.QueryOneofCase.FuzzyPronQuery:
                    {
                        throw new Exception("Not implemented");
                    }
                default:
                    throw new Exception("Not implemented");
            }
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
            return results.ScoreDocs.Select(sd =>
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

        private static string FindBestExplanation(YngdiengDocument ydDoc)
        {
            var fengExplation = ydDoc.Sources
                .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Feng)
                ?.Feng.ExplanationTrad;
            if (fengExplation != null)
            {
                return fengExplation.Truncate(50);
            }
            var contribExplanation = ydDoc.Sources
                        .FirstOrDefault(s => s.SourceCase == YngdiengDocument.Types.Source.SourceOneofCase.Contrib)
                        ?.Contrib.ExplanationRaw; //TODO:fix. explanation flattened.
            if (contribExplanation != null)
            {
                return contribExplanation.Truncate(50);
            }
            return string.Empty;
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
