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
                { Fields.Hanzi, new SmartChineseAnalyzer(AppLuceneVersion)},
                { Fields.Explanation, new SmartChineseAnalyzer(AppLuceneVersion)}
                };
            // create an analyzer to process the text
            return new PerFieldAnalyzerWrapper(
              /* default=*/ new StandardAnalyzer(AppLuceneVersion),
              analyzerPerField);
        }

        public static class Fields {
          public static string DocId {get=>"doc_id";}
          public static string Hanzi {get=>"hanzi";}
          /// <summary>
          /// Exact sandhi yngping
          /// </summary>
          public static string Yngping {get=>"yngping";}
          
          /// <summary>
          /// 连读后的声调.
          /// </summary>
          public static string YngpingSandhiTonePattern {get=>"yngping_sandhi_tone_pattern";}
          public static string Explanation {get=>"explanation";}
        }
    }
}
