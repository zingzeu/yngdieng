extern alias zingzeudata;

using System.Linq;
using LibHokchew.Shared.Yngping;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using static Yngdieng.Common.RichText.RichTextUtil;

namespace Yngdieng.Common.RichText
{
    public sealed class FengRichTextRenderer
    {
        private readonly ZhConverter zc;
        private readonly StructuredExplanationRenderer explanationRenderer;

        public FengRichTextRenderer(ZhConverter zhConverter)
        {
            this.zc = zhConverter;
            this.explanationRenderer = new StructuredExplanationRenderer(zhConverter);
        }

        public FengRichTextRenderer(ZhConverter zhConverter, StructuredExplanationRenderer explanationRenderer)
        {
            this.zc = zhConverter;
            this.explanationRenderer = explanationRenderer;
        }

        public RichTextNode ToRichTextNode(FengDocument doc)
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(zc.tH(doc.HanziOriginal),
                            RenderSourcePronunciations(
                                ToFeng(doc.YngpingUnderlyingOriginal),
                                ToFeng(doc.YngpingCanonicalOriginal))),
                        }
                }
            };
            if (doc.ExplanationStructured != null)
            {
                output.VerticalContainer.Children.Add(explanationRenderer.ToRichTextNode(doc.ExplanationStructured, doc.HanziCanonical));
            }
            else
            {
                output.VerticalContainer.Children.Add(SimpleText(zc.tH(doc.Explanation)));
            }
            output.VerticalContainer.Children.Add(Source(zc.tM($"出处：冯爱珍. 1998. 福州方言词典. 南京: 江苏教育出版社. 第 {doc.Source.PageNumber} 页. 用字可能经过编辑修订.")));
            return output;
        }

        private static string ToFeng(string yngpingSyllables)
        {
            var converted = yngpingSyllables
                .Split()
                .Select(FengConverter.ToFeng)
                .ToList();
            if (converted.Any(syllable => syllable == null))
            {
                return yngpingSyllables;
            }
            return "/" + string.Join(" ", converted) + "/";
        }
    }
}
