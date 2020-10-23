using System.Collections.Generic;
using System.Linq;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V1.Protos;
using Yngdieng.Protos;
using ZingzeuData.Models;
using static Yngdieng.Common.ExplanationUtil;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Renderers
    {

        public static IEnumerable<string> EmptyStringArray = new string[] { };

        public static RichTextNode ToRichTextNode(string hanzi, Db.Extension extension)
        {
            var parsed = SafeParseExplanation(extension.Explanation);
            var explanation = parsed == null ? JustText(extension.Explanation) : ToRichTextNode(parsed, hanzi);
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(hanzi),
                            explanation,
                            Source(extension.Source+"cONTRIBUTORS: "+string.Join(",",extension.Contributors)) // TODO
                        }
                }
            };
        }

        public static RichTextNode ToRichTextNode(FengDocument doc)
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(doc.HanziCanonical,$"{doc.YngpingUnderlying} -> {doc.YngpingCanonical}"),
                        }
                }
            };
            if (doc.ExplanationStructured != null)
            {
                output.VerticalContainer.Children.Add(ToRichTextNode(doc.ExplanationStructured, doc.HanziCanonical));
            }
            else
            {
                output.VerticalContainer.Children.Add(JustText(doc.Explanation));

            }
            return output;
        }

        private static RichTextNode ToRichTextNode(Explanation e, string currentWord = "～")
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children ={
                    Label("释义"),
                        new RichTextNode {
                            List = new RichTextNode.Types.ListNode {
                                Ordered = true,
                                Children = {e.Senses.Select(s =>
                                    ToRichTextNode(s,currentWord)
                                )}
                            }
                }

                }
                }
            };
            //todo: notes
            return output;
        }

        private static RichTextNode ToRichTextNode(Explanation.Types.Sense sense, string currentWord = "～")

        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {

                }
            };
            if (!string.IsNullOrWhiteSpace(sense.Text))
            {
                output.VerticalContainer.Children.Add(JustText(MaybeAddPeriod(sense.Text)));
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

        private static RichTextNode ToRichTextNode(string example, string currentWord)
        {
            return JustText(MaybeAddPeriod(example.Replace("～", currentWord)));
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

        public static RichTextNode ToRichTextNode(HistoricalDocument doc)
        {
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(HanziUtils.HanziToString(doc.HanziCanonical)),
                            Label("音韵地位（戚林八音）"),
                            SingleLineTextWithStyles("ok",EmptyStringArray),//TODO
                            Label("榕拼（八音）"),
                            SingleLineTextWithStyles(doc.Yngping,EmptyStringArray),
                             Label("教会罗马字"),
                            SingleLineTextWithStyles(doc.Buc,EmptyStringArray),
                            Source("来源：戚林八音校注, Dictionary of Foochow Dialect。"),//todo
                        }
                }
            };
        }

        private static RichTextNode SectionHeader(string hanzi, string pron)
        {
            return SingleLineTextWithStyles(hanzi, new string[] { "section-header" });
        }


        private static RichTextNode SectionHeader(string header)
        {
            return SingleLineTextWithStyles(header, new string[] { "section-header" });
        }

        private static RichTextNode Label(string label)
        {
            return SingleLineTextWithStyles(label, new string[] { "label" });
        }

        private static RichTextNode Source(string source)
        {
            return SingleLineTextWithStyles(source, new string[] { "source" });
        }

        private static RichTextNode JustText(string text)
        {
            return SingleLineTextWithStyles(text, EmptyStringArray);
        }

        private static RichTextNode SingleLineTextWithStyles(string text, IEnumerable<string> styles)
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
    }
}
