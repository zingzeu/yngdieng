using System.Collections.Generic;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using static Yngdieng.Common.RichText.RichTextUtil;

namespace Yngdieng.Common.RichText
{
    public sealed class HistoricalRichTextRenderer
    {
        private readonly ZhConverter zc;

        public HistoricalRichTextRenderer(ZhConverter zhConverter)
        {
            this.zc = zhConverter;
        }

        public RichTextNode ToRichTextNode(HistoricalDocument doc)
        {
            var sources = new List<string>();
            if (doc.CiklinSource != null)
            {
                sources.Add(zc.tM("戚林八音校注"));
            }
            if (doc.DfdSource != null)
            {
                sources.Add("榕腔注音辞典·目录");
            }
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(zc.tH(HanziUtils.HanziToString(doc.HanziCanonical))),
                            Label(zc.tM("音韵地位（戚林八音）")),
                            SimpleText(PhonologyUtils.ToHanzi(doc.Initial,doc.Final,doc.Tone) ),
                            Label(zc.tM("榕拼（八音）")),
                            SimpleText(doc.Yngping),
                             Label(zc.tM("教会罗马字")),
                            SimpleText(doc.Buc),
                            Source(zc.tM("来源："+string.Join(", ",sources))),
                        }
                }
            };
        }
    }
}
