extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.Linq;
using Google.Protobuf;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using ZingzeuData.Models;
using ZingzeuData.Parser;
using static Yngdieng.Common.ExplanationUtil;
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
                output.VerticalContainer.Children.Add(SimpleText(zc.tM(MaybeAddPeriod(e.NotesOriginal))));
            }
            if (!string.IsNullOrEmpty(e.NotesOurs))
            {
                output.VerticalContainer.Children.Add(Label(zc.tM("榕典注")));
                output.VerticalContainer.Children.Add(SimpleText(zc.tM(MaybeAddPeriod(e.NotesOurs))));
            }
            return output;
        }

        public RichTextNode ToRichTextNode(Explanation.Types.Sense sense, string currentWord = "～")

        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                }
            };
            if (!string.IsNullOrWhiteSpace(sense.Text))
            {
                output.VerticalContainer.Children.Add(SimpleText(zc.tM(MaybeAddPeriod(sense.Text))));
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
                    }
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
            return SimpleText(zc.tH(MaybeAddPeriod(example.Replace("～", currentWord))));
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
