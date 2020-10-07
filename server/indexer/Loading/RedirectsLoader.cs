extern alias zingzeudata;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using static Yngdieng.Indexer.ExplanationUtil;
using System;

namespace Yngdieng.Indexer.Loading
{

    public sealed class RedirectsLoader
    {
        private readonly string redirectsPath;

        public RedirectsLoader(string redirectsPath)
        {
            this.redirectsPath = redirectsPath;
        }

        public IDictionary<string, string> Run()
        {
            return File.ReadAllLines(redirectsPath)
                .Select(x => RemoveComment(x.Trim()).Split(' '))
                .Where(tokens => tokens.Length == 2)
                .Select(tokens => new {
                    FromDocId = tokens[0],
                    ToDocId = tokens[1] 
                })
                .ToDictionary(x=>x.FromDocId,x=>x.ToDocId);
        }

        private static string RemoveComment(string x)
        {
            var hashPos = x.IndexOf("#", StringComparison.Ordinal);
            if (hashPos < 0)
            {
                return x;
            }
            return x.Substring(0, hashPos);
        }
    }

}
