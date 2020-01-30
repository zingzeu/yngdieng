using System.Collections.Generic;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services {
    public class InMemorySearchCache : ISearchCache
    {

        private readonly Dictionary<string, IEnumerable<SearchResultRow>> _cache 
            = new Dictionary<string, IEnumerable<SearchResultRow>>();
        IEnumerable<SearchResultRow>? ISearchCache.Get(string queryText)
        {
            if (_cache.ContainsKey(queryText)) {
                return _cache[queryText];
            }
            else {
                return null;
            }
        }

        void ISearchCache.Put(string queryText, IEnumerable<SearchResultRow> completeSearchResult)
        {
            _cache[queryText] = completeSearchResult;
        }
    }

    public interface ISearchCache {
        void Put(string queryText, IEnumerable<SearchResultRow> completeSearchResult);
        IEnumerable<SearchResultRow>? Get(string queryText); 
    }
}
