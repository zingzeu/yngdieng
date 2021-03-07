extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.Linq;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using ZingzeuData.Models;
using static Yngdieng.Common.RichText.RichTextUtil;

namespace Yngdieng.Common.RichText
{
    public sealed class StructuredExplanationRenderer
    {
        private readonly ZhConverter zc;

        public StructuredExplanationRenderer(ZhConverter zhConverter)
        {
            this.zc = zhConverter;
        }

        public RichTextNode ToRichTextNode(Explanation e, string currentWord = "～")
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                        Label(zc.tM("释义")),
                        new RichTextNode {
                            List = new RichTextNode.Types.ListNode {
                                Ordered = true,
                                Children = {e.Senses.Select(s =>
                                    ToRichTextNode(s, currentWord)
                                )}
                            }
                        }
                    }
                }
            };
            if (!string.IsNullOrEmpty(e.NotesOriginal))
            {
                output.VerticalContainer.Children.Add(Label(zc.tM("注")));
                output.VerticalContainer.Children.Add(
                    SimpleTextWithOuterStyles(zc.tM(MaybeAddPeriod(e.NotesOriginal)),
                    new string[] { "notes" }));
            }
            if (!string.IsNullOrEmpty(e.NotesOurs))
            {
                output.VerticalContainer.Children.Add(Label(zc.tM("榕典注")));
                output.VerticalContainer.Children.Add(
                    SimpleTextWithOuterStyles(zc.tM(MaybeAddPeriod(e.NotesOurs)),
                    new string[] { "notes" }));
            }
            return output;
        }

        public RichTextNode ToRichTextNode(Explanation.Types.Sense sense, string currentWord = "～")
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                },
                Styles = { "sense" }
            };
            if (!string.IsNullOrWhiteSpace(sense.Text))
            {
                output.VerticalContainer.Children.Add(SimpleTextWithOuterStyles(
                    zc.tM(MaybeAddPeriod(sense.Text)),
                    new string[] { "sense" }));
            }
            if (sense.Examples.Count() > 0)
            {
                output.VerticalContainer.Children.Add(
                new RichTextNode()
                {
                    List = new RichTextNode.Types.ListNode()
                    {
                        Children = {sense.Examples.Select(ex =>
                                                    ToRichTextNode(ex, currentWord)
                                                )}
                    },
                    Styles = { "examples-list" }
                }
                );
            }
            if (sense.ChildSenses.Count() > 0)
            {
                output.VerticalContainer.Children.Add(
                new RichTextNode()
                {
                    List = new RichTextNode.Types.ListNode()
                    {
                        Ordered = true,
                        Children = {sense.ChildSenses.Select(c =>
                                                    ToRichTextNode(c, currentWord)
                                                )}
                    }
                }
                );
            }
            return output;
        }

        private RichTextNode ToRichTextNode(string example, string currentWord)
        {
            var segments = zc.tH(MaybeAddPeriod(example)).Split("～");
            var normalTextNodes = segments.Select(s => new RichTextNode.Types.TextNode()
            {
                Text = s,
            });
            var currentWordNode = new RichTextNode.Types.TextNode()
            {
                Text = currentWord,
                Styles = { "current-word" }
            };
            var inlineNodes = Join(normalTextNodes, currentWordNode)
                .Select(t =>
                    new RichTextNode.Types.InlineNode()
                    {
                        Text = t
                    });
            return new RichTextNode()
            {
                InlineContainer = new RichTextNode.Types.InlineContainerNode()
                {
                    Children = {
                            inlineNodes
                        }
                },
                Styles = { "example" }
            };
        }

        private static IEnumerable<RichTextNode.Types.TextNode> Join(IEnumerable<RichTextNode.Types.TextNode> list, RichTextNode.Types.TextNode separator)
        {
            return list.Aggregate(new List<RichTextNode.Types.TextNode>(),
            (list, next) =>
            {
                if (list.Count > 0)
                {
                    list.Add(separator);
                }
                list.Add(next);
                return list;
            }, list => list.AsReadOnly());
        }

        private static string MaybeAddPeriod(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return text;
            }
            var trimmed = text.Trim();
            var lastChar = trimmed.Substring(trimmed.Length - 1);
            if (
              lastChar == "。" ||
              lastChar == "，" ||
              lastChar == "！" ||
              lastChar == "？"
            )
            {
                return trimmed;
            }
            return trimmed + '。';
        }

    }
}
