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
    private static readonly int PageSize = 10;

    public override Task<SearchResponse> Search(SearchRequest request, ServerCallContext context)
    {
      _logger.LogInformation("Received SearchRequest" + request.ToString());
      var watch = System.Diagnostics.Stopwatch.StartNew();
      var response = new SearchResponse();

      // Check cache
      var maybeCacheResult = _cache.Get(request.Query);
      IEnumerable<SearchResultRow> results;
      
      if (maybeCacheResult == null) {
        _logger.LogInformation("Cache miss");
        var query = QueryParser.Parse(request.Query) ?? throw new Exception("Invalid query");
        results = SearchInternal(query).ToList(); // Materialise now
        _cache.Put(request.Query, results);
      } else {
        _logger.LogInformation("Cache hit");
        results = maybeCacheResult;
      }

      // Poor man's pagination
      response.Length = results.Count();
      response.Results.AddRange(results.Skip((int)request.Offset).Take(PageSize));

      watch.Stop();
      response.ComputationTimeMs = watch.ElapsedMilliseconds;
      return Task.FromResult(response);
    }

    private IEnumerable<SearchResultRow> SearchInternal(Query query)
    {
      switch (query.QueryCase)
      {
        case Query.QueryOneofCase.PhonologyQuery:
          {
            return QueryByPhonologyAggregated(query.PhonologyQuery, query.SortBy).Select(a =>
             new SearchResultRow
             {
               AggregatedDocument = a
             }
            );
          }
        case Query.QueryOneofCase.HanziQuery:
          {
            string hanziQuery = query.HanziQuery;
            // 单字条目优先

            var monoHanziResults = QueryMonoHanziAggregated(query.HanziQuery, query.SortBy).Select(a =>
            new SearchResultRow
            {
              AggregatedDocument = a
            });

            // 之后是词汇（冯版），如有
            var vocabResults = QueryVocab(hanziQuery).Select(d => new SearchResultRow
            {
              FengDocument = d
            });
            return monoHanziResults.Concat(vocabResults);
          }
        case Query.QueryOneofCase.FuzzyPronQuery:
          {
            return QueryByFuzzyPron(query.FuzzyPronQuery).Select(d => new SearchResultRow
            {
              FengDocument = d
            });
          }
        default:
          throw new Exception("Not implemented");
      }
    }

    private IEnumerable<Document> QueryByPhonology(PhonologyQuery query, SortByMethod sortBy)
    {
      Initial initial = query.Initial;
      Final final = query.Final;
      Tone tone = query.Tone;
      if (initial == Initial.Unspecified &&
          final == Final.Unspecified &&
          tone == Tone.Unspecified)
      {
        throw new Exception("Cannot all be unspecified");
      }
      // Filter
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
      var matchedDocuments = documents;
      // Sort
      IEnumerable<Document> sorted;
      switch (sortBy)
      {
        case SortByMethod.InitialFinalTone:
          sorted = matchedDocuments.OrderBy(d => d.Final)
              .ThenBy(d => d.Initial)
              .ThenBy(d => d.Tone);
          break;
        case SortByMethod.SortByUnspecified:
        default:
          sorted = matchedDocuments;
          break;
      }
      return sorted;
    }

    private IEnumerable<AggregatedDocument> QueryByPhonologyAggregated(PhonologyQuery query, SortByMethod sortBy)
    {
      Initial initial = query.Initial;
      Final final = query.Final;
      Tone tone = query.Tone;
      if (initial == Initial.Unspecified &&
          final == Final.Unspecified &&
          tone == Tone.Unspecified)
      {
        throw new Exception("Cannot all be unspecified");
      }
      // Filter
      var documents = _indexHolder.GetIndex().AggregatedDocument.Where(_ => true);
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
      var matchedDocuments = documents;
      // Sort
      IEnumerable<AggregatedDocument> sorted;
      switch (sortBy)
      {
        case SortByMethod.InitialFinalTone:
          sorted = matchedDocuments.OrderBy(d => d.Final)
              .ThenBy(d => d.Initial)
              .ThenBy(d => d.Tone);
          break;
        case SortByMethod.SortByUnspecified:
        default:
          sorted = matchedDocuments;
          break;
      }
      return sorted;
    }

    /// <summary>
    /// 查询单字条目。
    /// </summary>
    private IEnumerable<Document> QueryMonoHanzi(string query, SortByMethod sortBy)
    {
      var matchedDocuments = _indexHolder.GetIndex().Documents
                .Where(d =>
                    GetHanzi(d.HanziCanonical) == query
                    || d.HanziAlternatives.Where(
                        r => GetHanzi(r) == query).Count() > 0
                    || d.HanziMatchable.IndexOf(query) >= 0
                );
      IEnumerable<Document> sorted;
      switch (sortBy)
      {
        case SortByMethod.InitialFinalTone:
          sorted = matchedDocuments.OrderBy(d => d.Final)
                      .ThenBy(d => d.Initial)
                      .ThenBy(d => d.Tone);
          break;
        case SortByMethod.SortByUnspecified:
        default:
          sorted = matchedDocuments;
          break;
      }
      return sorted;
    }

    /// <summary>
    /// 查询词汇 (冯版)
    /// </summary>
    private IEnumerable<FengDocument> QueryVocab(string query)
    {
      var matchedDocuments = _indexHolder.GetIndex().FengDocuments
        .Where(d =>
          d.HanziCanonical.Contains(query)
          || d.Explanation.Contains(query))
          .OrderByDescending(d => ScoreVocabQueryResult(query, d));
      //TODO: rank and order
      return matchedDocuments;
    }

    private static int ScoreVocabQueryResult(string query, FengDocument matchedDocument)
    {
      int score = 0;
      if (matchedDocument.HanziCanonical.Contains(query))
      {
        var distance = matchedDocument.HanziCanonical.Length - query.Length + 1;
        score += 1000 / distance;
      }
      if (matchedDocument.Explanation.Contains(query))
      {
        score += 10 * matchedDocument.Explanation.CountOccurences(query);
      }
      return score;
    }

    /// <summary>
    /// 模糊拼音查询。
    /// </summary>
    /// <param name="yngping"></param>
    /// <returns></returns>
    private IEnumerable<FengDocument> QueryByFuzzyPron(string yngping)
    {
      var matchedDocuments = _indexHolder.GetIndex().FengDocuments
        .Where(d =>
          d.YngpingPermutations.Contains(yngping));
      //TODO: rank and order
      return matchedDocuments;
    }

    /// <summary>
    /// 查询单字条目（合并来源)。
    /// </summary>
    /// <returns></returns>
    private IEnumerable<AggregatedDocument> QueryMonoHanziAggregated(string query, SortByMethod sortBy)
    {
      var matchedDocuments = _indexHolder.GetIndex().AggregatedDocument
                .Where(d =>
                    GetHanzi(d.HanziCanonical) == query
                    || d.HanziAlternatives.Where(
                        r => GetHanzi(r) == query).Count() > 0
                    || d.HanziMatchable.IndexOf(query) >= 0
                );
      IEnumerable<AggregatedDocument> sorted;
      switch (sortBy)
      {
        case SortByMethod.InitialFinalTone:
          sorted = matchedDocuments.OrderBy(d => d.Final)
                      .ThenBy(d => d.Initial)
                      .ThenBy(d => d.Tone);
          break;
        case SortByMethod.SortByUnspecified:
        default:
          sorted = matchedDocuments;
          break;
      }
      return sorted;
    }

  }

}
