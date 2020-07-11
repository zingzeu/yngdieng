extern alias zingzeudata;
using System.Collections.Generic;
using System;
using System.IO;
using System.Linq;
using ZingzeuData.Models;
using ZingzeuData.Parser;

namespace Yngdieng.Indexer.Loading
{

    public sealed class ContribLoader
    {
        private readonly string contribPath;

        public ContribLoader(string contribPath)
        {
            this.contribPath = contribPath;
        }

        public IEnumerable<zingzeudata.ZingzeuData.Models.ContribEntry> Run()
        {
            return zingzeudata.ZingzeuData.Parser.ParseContrib.GetContribEntries(contribPath);
        }
    }

}