using System;
using System.IO;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Lucene.Net.QueryParsers.Classic;
using Yngdieng.Search.Common;

namespace searcher
{
  class Program
  {
    static void Main(string[] args)
    {
      // TODO SEARCH MULTI FILED
      var parser = new QueryParser(LuceneUtils.AppLuceneVersion, "explanation", LuceneUtils.GetAnalyzer());
      // search with a phrase
      //var phrase = new MultiPhraseQuery();
      //phrase.Add(new Term("hanzi", "講"));
      //phrase.Add(new Term("explanation", "義"));
      var query = parser.Parse("女人");
      var reader =  DirectoryReader.Open( FSDirectory.Open(new DirectoryInfo("../../output/lucene")));
      var searcher = new IndexSearcher(reader);
      var hits = searcher.Search(query, 20 /* top 20 */).ScoreDocs;
      foreach (var hit in hits)
      {
        var foundDoc = searcher.Doc(hit.Doc);
        var docId = foundDoc.Get("doc_id");
        Console.WriteLine($"{hit.Score} https://www.ydict.net/w/{docId}");
      }
    }
  }
}
