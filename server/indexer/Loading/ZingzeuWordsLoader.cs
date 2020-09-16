extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ZingzeuData.Models;
using ZingzeuData.Parser;

namespace Yngdieng.Indexer.Loading
{

    public sealed class ZingzeuWordsLoader
    {
        private readonly string zingzeuWordsPath;

        public ZingzeuWordsLoader(string zingzeuWordsPath)
        {
            this.zingzeuWordsPath = zingzeuWordsPath;
        }

        public IEnumerable<zingzeudata.ZingzeuData.Models.ZingzeuEntry> Run()
        {
            return zingzeudata.ZingzeuData.Parser.ParseZingzeu.GetEntries(zingzeuWordsPath);
        }
    }

}
