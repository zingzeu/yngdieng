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
