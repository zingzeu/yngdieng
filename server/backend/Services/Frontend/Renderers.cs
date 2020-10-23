using System.Collections.Generic;
using System.Linq;
using Yngdieng.Common;
using Yngdieng.Frontend.V1.Protos;
using Yngdieng.Protos;
namespace Yngdieng.Backend.Services.Frontend
{
    public static class Renderers
    {

        public static IEnumerable<string> EmptyStringArray = new string[] { };
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
