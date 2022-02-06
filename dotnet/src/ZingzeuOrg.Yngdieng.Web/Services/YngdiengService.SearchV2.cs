using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using ZingzeuOrg.Yngdieng.Web.Db;
using ZingzeuOrg.Yngdieng.Web.Services.Frontend;
using Yngdieng.Common;
using YngdiengProtos = Yngdieng.Protos;
using Yngdieng.Search.Common;
using static Yngdieng.Common.StringExt;
using LuceneQuery = Lucene.Net.Search.Query;

namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : YngdiengProtos.YngdiengService.YngdiengServiceBase
    {

        private static readonly int DefaultPageSize = 10;
        private static readonly Filter FilterSourcelessDocs = NumericRangeFilter.NewInt32Range(LuceneUtils.Fields.IsSourceless, 4, 0, 0, true, true);

        public override Task<YngdiengProtos.SearchV2Response> SearchV2(YngdiengProtos.SearchV2Request request,
                                                        ServerCallContext context)
        {
            var userPreference = UserPreferences.FromContext(context);
            var query = GetLuceneQuery(QueryParser.Parse(request.Query));
            var desiredPageSize = request.PageSize > 0 ? request.PageSize : DefaultPageSize;
            var searcher = this._indexHolder.LuceneIndexSearcher;

            var resultCards = new List<YngdiengProtos.SearchV2Response.Types.SearchCard>();

            TopDocs results;
            if (string.IsNullOrEmpty(request.PageToken))
            {
                // Is first page 
                results = searcher.Search(query, userPreference.ShowSourcelessSearchResults ? null : FilterSourcelessDocs, desiredPageSize + 1);
                // first page && no results
                if (results.ScoreDocs.Length == 0)
                {
                    return Task.FromResult(new YngdiengProtos.SearchV2Response
                    {
                        ResultCards = { NoResultsCard() }
                    });
                }
            }
            else
            {
                var lastPage = PaginationTokens.Parse(request.PageToken);
                var lastScoreDoc = new ScoreDoc(lastPage.LastDoc.Doc, lastPage.LastDoc.Score);
                results = searcher.SearchAfter(lastScoreDoc, query, userPreference.ShowSourcelessSearchResults ? null : FilterSourcelessDocs, desiredPageSize + 1);
            }

            var zhConverter = new ZhConverter(_openCc, userPreference.ZhConversionPreference);
            var response = new YngdiengProtos.SearchV2Response();
            var isEndOfResults = results.ScoreDocs.Length < desiredPageSize + 1;
            if (isEndOfResults)
            {
                resultCards.AddRange(RenderDocs(results.ScoreDocs, zhConverter));
                resultCards.Add(EndOfResultsCard());
            }
            else
            {
                var visibleRange = results.ScoreDocs.Take(desiredPageSize);
                var nextPageToken = PaginationTokens.FromScoreDoc(visibleRange.Last());
                response.NextPageToken = nextPageToken;
                resultCards.AddRange(RenderDocs(visibleRange, zhConverter));
            }

            response.ResultCards.AddRange(resultCards);
            return Task.FromResult(response);
        }

        private LuceneQuery GetLuceneQuery(YngdiengProtos.Query query)
        {
            switch (query.QueryCase)
            {
                case YngdiengProtos.Query.QueryOneofCase.HanziQuery:
                    return HandleHanziQuery(query.HanziQuery);
                case YngdiengProtos.Query.QueryOneofCase.YngpingTonePatternQuery:
                    return HandleYngpingTonePatternQuery(query.YngpingTonePatternQuery);
                case YngdiengProtos.Query.QueryOneofCase.FuzzyPronQuery:
                    return HandleFuzzyYngpingQuery(query.FuzzyPronQuery);
                default:
                    throw new ArgumentException($"Unsupported query type: {query.QueryCase}");
            }
        }

        private static LuceneQuery HandleFuzzyYngpingQuery(string queryText)
        {
            var queryParser = new MultiFieldQueryParser(LuceneUtils.AppLuceneVersion,
            new string[] { LuceneUtils.Fields.Yngping },
                        LuceneUtils.GetAnalyzer(),
                        new Dictionary<string, float>{
                {LuceneUtils.Fields.Yngping, 100},
                        });
            return queryParser.Parse(queryText);
        }

        private static LuceneQuery HandleYngpingTonePatternQuery(string queryText)
        {
            return new WildcardQuery(new Lucene.Net.Index.Term(LuceneUtils.Fields.YngpingSandhiTonePattern, queryText));
        }

        private static LuceneQuery HandleHanziQuery(string queryText)
        {
            var queryParser = new MultiFieldQueryParser(
                LuceneUtils.AppLuceneVersion,
                new string[] {
                    LuceneUtils.Fields.Mandarin,
                    LuceneUtils.Fields.Hanzi,
                    LuceneUtils.Fields.HanziAlternative,
                    LuceneUtils.Fields.Explanation
                },
                LuceneUtils.GetAnalyzer(),
                new Dictionary<string, float>{
                    {LuceneUtils.Fields.Mandarin, 200},
                    {LuceneUtils.Fields.Hanzi, 100},
                    {LuceneUtils.Fields.HanziAlternative, 50},
                    {LuceneUtils.Fields.Explanation, 1}
                });
            return queryParser.Parse(queryText);
        }

        private IEnumerable<YngdiengProtos.SearchV2Response.Types.SearchCard> RenderDocs(IEnumerable<ScoreDoc> scoreDocs, ZhConverter zhConverter)
        {
            var searcher = this._indexHolder.LuceneIndexSearcher;

            return scoreDocs.Select(sd =>
           {
               var docId = searcher.Doc(sd.Doc).GetField(LuceneUtils.Fields.DocId).GetStringValue();
               var ydDoc = _indexHolder.GetIndex().YngdiengDocuments.Single(y => y.DocId == docId);

               return new YngdiengProtos.SearchV2Response.Types.SearchCard
               {
                   Word = new YngdiengProtos.SearchV2Response.Types.SearchCard.Types.WordCard
                   {
                       Id = docId,
                       Yngping = RichTextUtil.FromString(ydDoc.YngpingSandhi.OrElse(ydDoc.YngpingUnderlying)),
                       Hanzi = RichTextUtil.FromString(zhConverter.tH(HanziUtils.HanziToString(ydDoc.HanziCanonical))),
                       Details = RichTextUtil.FromString(zhConverter.tM(Words.GetSnippet
                            (ydDoc, new Extension[] { }))),
                       Score = sd.Score
                   }
               };
           });
        }

        private static YngdiengProtos.SearchV2Response.Types.SearchCard GenericMessageCard(string message)
        {
            return new YngdiengProtos.SearchV2Response.Types.SearchCard
            {
                GenericMessage = new YngdiengProtos.SearchV2Response.Types.SearchCard.Types
                                                          .GenericMessageCard()
                {
                    Message = RichTextUtil.FromString(message)
                }
            };
        }
        private static YngdiengProtos.SearchV2Response.Types.SearchCard EndOfResultsCard()
        {
            return new YngdiengProtos.SearchV2Response.Types.SearchCard
            {
                EndOfResults = new YngdiengProtos.SearchV2Response.Types.SearchCard.Types
                                                          .EndOfResultsCard()
            };
        }

        private static YngdiengProtos.SearchV2Response.Types.SearchCard NoResultsCard()
        {
            return new YngdiengProtos.SearchV2Response.Types.SearchCard
            {
                NoResults = new YngdiengProtos.SearchV2Response.Types.SearchCard.Types
                                                          .NoResultsCard()
            };
        }
    }

}
