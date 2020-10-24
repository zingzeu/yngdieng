using System.Collections.Generic;
using System.Linq;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using ZingzeuData.Models;
using static Yngdieng.Common.ExplanationUtil;
using Word = Yngdieng.Frontend.V3.Protos.Word;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Renderers
    {

        public static Word.Types.AudioCard ToAudioCard(Db.AudioClipsByWordId a)
        {
            var gender = a.SpeakerGender == Gender.MALE ? "男" : "女";
            var hintPrimary = a.SpeakerAge.HasValue ? $"{a.SpeakerDisplayName} | {a.SpeakerAge} | {gender}"
                : $"{a.SpeakerDisplayName} | {gender}";
            return new Word.Types.AudioCard()
            {
                Pronunciation = a.Pronunciation,
                HintPrimary = hintPrimary,
                HintSecondary = a.SpeakerLocation ?? string.Empty,
                Audio = new AudioResource()
                {
                    RemoteUrls = new AudioResource.Types.RemoteUrls()
                    {
                        RemoteUrls_ = { "https://yngdieng-media.oss-cn-hangzhou.aliyuncs.com/" + a.BlobLocation }
                    }
                }
            };
        }

        public static Yngdieng.Frontend.V3.Protos.WordList ToWordList(Db.WordList wordList)
        {
            return new Yngdieng.Frontend.V3.Protos.WordList()
            {
                Name = ResourceNames.ToWordListName(wordList.WordListId),
                Title = wordList.Title,
                Description = wordList.Description,
                Upvotes = 123,
            };
        }

        public static RichTextNode ToRichTextNode(string hanzi, Extension extension)
        {
            var parsed = SafeParseExplanation(extension.Explanation);
            var explanation = parsed == null ? SimpleText(extension.Explanation) : ToRichTextNode(parsed, hanzi);
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(hanzi),
                            explanation,
                            Source(extension.Source.OrElse("此释义来自网友贡献。")+" 贡献者: "+string.Join(",",extension.Contributors))
                        }
                }
            };
        }

        public static RichTextNode ToRichTextNode(ContribDocument doc)
        {
            var output = new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children =
                    {
                        SectionHeader(doc.Hanzi, $"{doc.YngpingUnderlying} -> {doc.YngpingSandhi}"),
                        ToRichTextNode(doc.ExplanationStructured)
                    }
                }
            };
            if (doc.ExplanationStructured != null)
            {
                output.VerticalContainer.Children.Add(ToRichTextNode(doc.ExplanationStructured, doc.Hanzi));
            }
            else
            {
                output.VerticalContainer.Children.Add(SimpleText(doc.ExplanationRaw));
            }
            output.VerticalContainer.Children.Add(
                Source("此释义来自网友贡献。 贡献者: " + string.Join(",", doc.Contributors))
            );
            return output;
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
                output.VerticalContainer.Children.Add(SimpleText(doc.Explanation));
            }
            output.VerticalContainer.Children.Add(Source($"出处：冯爱珍. 1998. 福州方言词典. 南京: 江苏教育出版社. 第 {doc.Source.PageNumber} 页. 用字可能经过编辑修订."));
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
            if (!string.IsNullOrEmpty(e.NotesOriginal))
            {
                output.VerticalContainer.Children.Add(Label("注"));
                output.VerticalContainer.Children.Add(SimpleText(MaybeAddPeriod(e.NotesOriginal)));
            }
            if (!string.IsNullOrEmpty(e.NotesOurs))
            {
                output.VerticalContainer.Children.Add(Label("榕典注"));
                output.VerticalContainer.Children.Add(SimpleText(MaybeAddPeriod(e.NotesOurs)));
            }
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
                output.VerticalContainer.Children.Add(SimpleText(MaybeAddPeriod(sense.Text)));
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
            return SimpleText(MaybeAddPeriod(example.Replace("～", currentWord)));
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
            var sources = new List<string>();
            if (doc.CiklinSource != null)
            {
                sources.Add("戚林八音校注");
            }
            if (doc.DfdSource != null)
            {
                sources.Add("Dictionary of the Foochow Dialect");
            }
            return new RichTextNode()
            {
                VerticalContainer = new RichTextNode.Types.VerticalContainerNode()
                {
                    Children = {
                            SectionHeader(HanziUtils.HanziToString(doc.HanziCanonical)),
                            Label("音韵地位（戚林八音）"),
                            SimpleText(PhonologyUtils.ToHanzi(doc.Initial,doc.Final,doc.Tone) ),
                            Label("榕拼（八音）"),
                            SimpleText(doc.Yngping),
                             Label("教会罗马字"),
                            SimpleText(doc.Buc),
                            Source("来源："+string.Join(", ",sources)),
                        }
                }
            };
        }

        private static RichTextNode[] SectionHeader(string hanzi, string pron)
        {
            return new RichTextNode[]
            {
                SingleLineTextWithStyles(hanzi, new string[] {"section-header"}),
                SingleLineTextWithStyles(pron, new string[] {"section-header-small"})
            };
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

        private static RichTextNode SimpleText(string text)
        {
            return SingleLineTextWithStyles(text, Enumerable.Empty<string>());
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
