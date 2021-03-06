extern alias zingzeudata;
using System.Collections.Generic;
using System.Linq;
using Yngdieng.Frontend.V3.Protos;

namespace Yngdieng.Common.RichText
{
    public static class RichTextUtil
    {

        public static RichTextNode SectionHeader(string hanzi, string pron)
        {
            return new RichTextNode()
            {
                InlineContainer = new RichTextNode.Types.InlineContainerNode()
                {
                    Children = {
                            new RichTextNode.Types.InlineNode() {
                                Text =
                                    new RichTextNode.Types.TextNode() {
                                        Text = hanzi,
                                        Styles= {"section-header"}
                                    }
                            },
                            new RichTextNode.Types.InlineNode() {
                                Text =
                                    new RichTextNode.Types.TextNode() {
                                        Text = pron,
                                        Styles= {"section-header-small"}
                                    }
                            }
                        }
                }
            };
        }

        public static RichTextNode SectionHeader(string header)
        {
            return SingleLineTextWithStyles(header, new string[] { "section-header" });
        }

        public static RichTextNode Label(string label)
        {
            return SingleLineTextWithStyles(label, new string[] { "label" });
        }

        public static RichTextNode Source(string source)
        {
            return SingleLineTextWithStyles(source, new string[] { "source" });
        }

        public static RichTextNode SimpleText(string text)
        {
            return SingleLineTextWithStyles(text, Enumerable.Empty<string>());
        }

        public static RichTextNode SimpleTextWithOuterStyles(string text, IEnumerable<string> styles)
        {
            return new RichTextNode()
            {
                InlineContainer = new RichTextNode.Types.InlineContainerNode()
                {
                    Children = {
                            new RichTextNode.Types.InlineNode() {
                                Text =
                                    new RichTextNode.Types.TextNode() {
                                        Text = text,
                                    }
                            }
                        }
                },
                Styles = { styles }
            };
        }

        public static RichTextNode SingleLineTextWithStyles(string text, IEnumerable<string> styles)
        {
            return new RichTextNode()
            {
                InlineContainer = new RichTextNode.Types.InlineContainerNode()
                {
                    Children = {
                            new RichTextNode.Types.InlineNode() {
                                Text =
                                    new RichTextNode.Types.TextNode() {
                                        Text = text,
                                        Styles= {styles}
                                    }
                            }
                        }
                }
            };
        }
        public static string RenderSourcePronunciations(string maybeBenzi, string maybeSandhi)
        {
            var differentBenziAndSandhi = !string.IsNullOrEmpty(maybeBenzi) && !string.IsNullOrEmpty(maybeSandhi)
                && maybeBenzi != maybeSandhi;
            if (differentBenziAndSandhi)
            {
                return $"{maybeBenzi} -> {maybeSandhi}";
            }
            var onlyPron = string.IsNullOrEmpty(maybeBenzi) ? maybeSandhi : maybeBenzi;
            return onlyPron;
        }

    }
}
