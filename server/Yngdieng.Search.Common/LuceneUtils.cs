using System;
using System.Collections.Generic;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Cn.Smart;
using Lucene.Net.Analysis.Miscellaneous;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Util;

namespace Yngdieng.Search.Common
{
  public static class LuceneUtils
  {
    public static LuceneVersion AppLuceneVersion { get => LuceneVersion.LUCENE_48; }

    public static Analyzer GetAnalyzer()
    {
      var analyzerPerField = new Dictionary<string, Analyzer> {
                { "explanation", new SmartChineseAnalyzer(AppLuceneVersion)}
                };
      //create an analyzer to process the text
      return new PerFieldAnalyzerWrapper(
        /* default=*/new StandardAnalyzer(AppLuceneVersion),
        analyzerPerField);
    }
  }
}
