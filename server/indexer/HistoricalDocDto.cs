using System.Collections.Generic;
using Yngdieng.Protos;

namespace Yngdieng.Indexer
{

    public abstract class HistoricalDocDto
    {

        public Hanzi HanziCanonical { get; set; }

        /// <summary>
        /// 等价汉字.
        /// </summary>
        public List<Hanzi> HanziAlternatives { get; } = new List<Hanzi>();

        /// <summary>
        /// 所有可搜寻到该文档的汉字. (含简繁异体，索引用)
        /// </summary>
        public List<string> HanziMatchable { get; } = new List<string>();

        public Initial Initial { get; set; }

        public Final Final { get; set; }

        public Tone Tone { get; set; }

        public string Buc { get; set; }

    }

    public sealed class CikLingDto : HistoricalDocDto
    {
        public CikLinSourceInfo CikLinSourceInfo { get; set; }
    }

    public sealed class DfdDto : HistoricalDocDto
    {
        public DFDSourceInfo DFDSourceInfo { get; set; }
    }
}
