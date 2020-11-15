using System.Collections.Generic;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using static Yngdieng.Common.ExplanationUtil;
using static Yngdieng.Common.RichText.RichTextUtil;

namespace Yngdieng.Common.RichText
{
    public sealed class ExtensionRichTextRenderer
    {
        private readonly ZhConverter zc;
        private readonly StructuredExplanationRenderer explanationRenderer;

        public ExtensionRichTextRenderer(ZhConverter zhConverter)
        {
            this.zc = zhConverter;
            this.explanationRenderer = new StructuredExplanationRenderer(zhConverter);
        }

        public ExtensionRichTextRenderer(ZhConverter zhConverter, StructuredExplanationRenderer explanationRenderer)
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
                        explanationRenderer.ToRichTextNode(doc.ExplanationStructured)
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

        public RichTextNode ToRichTextNode(string hanzi, string explanation, string? source, IEnumerable<string> contributors)
        {
            var parsed = SafeParseExplanation(explanation);
            var explanationRichText = parsed == null ? SimpleText(explanation) : explanationRenderer.ToRichTextNode(parsed, hanzi);
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(hanzi),
                            explanationRichText,
                            Source(source.OrElse("此释义来自网友贡献。")+" 贡献者: "+string.Join(",",contributors))
                        }
                }
            };
        }

    }
}
