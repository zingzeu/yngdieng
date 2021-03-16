extern alias zingzeudata;
using System;
using System.Linq;
using Google.Protobuf;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using ZingzeuData.Models;
using ZingzeuData.Parser;
using static Yngdieng.Common.RichText.RichTextUtil;

namespace Yngdieng.Common.RichText
{
    public sealed class ContribRichTextRenderer
    {
        private readonly ZhConverter zc;
        private readonly StructuredExplanationRenderer explanationRenderer;

        public ContribRichTextRenderer(ZhConverter zhConverter)
        {
            this.zc = zhConverter;
            this.explanationRenderer = new StructuredExplanationRenderer(zhConverter);
        }

        public ContribRichTextRenderer(ZhConverter zhConverter, StructuredExplanationRenderer explanationRenderer)
        {
            this.zc = zhConverter;
            this.explanationRenderer = explanationRenderer;
        }

        public RichTextNode ToRichTextNode(ContribDocument doc)
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children =
                    {
                        SectionHeader(doc.Hanzi,  RenderSourcePronunciations(doc.YngpingUnderlying, doc.YngpingSandhi)),
                    }
                }
            };
            if (doc.ExplanationStructured != null)
            {
                output.VerticalContainer.Children.Add(explanationRenderer.ToRichTextNode(doc.ExplanationStructured, doc.Hanzi));
            }
            else
            {
                output.VerticalContainer.Children.Add(SimpleText(zc.tH(doc.ExplanationRaw)));
            }
            output.VerticalContainer.Children.Add(
                Source(zc.tM("此释义来自网友贡献。 贡献者: " + string.Join(",", doc.Contributors)))
            );
            return output;
        }

    }
}
