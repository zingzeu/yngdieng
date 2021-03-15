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
            var children = new List<RichTextNode>();
            children.Add(SectionHeader(zc.tH(HanziUtils.HanziToString(doc.HanziCanonical))));
            children.Add(Label(zc.tM("音韵地位（戚林八音）")));
            children.Add(SimpleText(PhonologyUtils.ToHanzi(doc.Initial, doc.Final, doc.Tone)));
            children.Add(Label(zc.tM("榕拼（八音）")));
            children.Add(SimpleText(doc.Yngping));
            children.Add(Label(zc.tM("教会罗马字")));
            children.Add(SimpleText(doc.Buc));
            if (!string.IsNullOrEmpty(doc.CiklinSource?.ExplanationCik))
            {
                children.Add(Label(zc.tM("戚书释义")));
                children.Add(SimpleText(zc.tM(doc.CiklinSource.ExplanationCik)));
            }
            if (!string.IsNullOrEmpty(doc.CiklinSource?.ExplanationLing))
            {
                children.Add(Label(zc.tM("林书释义")));
                children.Add(SimpleText(zc.tM(doc.CiklinSource.ExplanationLing)));
            }
            children.Add(Source(zc.tM("来源：" + string.Join(", ", sources))));
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                           children
                        }
                }
            };
        }
    }
}
