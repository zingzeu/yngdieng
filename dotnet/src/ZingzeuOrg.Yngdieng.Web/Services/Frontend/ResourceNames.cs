using System;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Frontend
{
    public static class ResourceNames
    {
        private static readonly RouteTemplate WordResourceNameTemplate = TemplateParser.Parse("words/{word}");
        private static readonly RouteTemplate WordListResourceNameTemplate = TemplateParser.Parse("wordLists/{wordList}");

        public static string ToDocId(string name)
        {
            var outs = new RouteValueDictionary();
            if (!new TemplateMatcher(WordResourceNameTemplate, null).TryMatch("/" + name, outs))
            {
                throw new ArgumentException($"{name} is not a Word resource name.");
            }
            return (string)outs["word"];
        }

        public static DocRef ToDocRef(int wordId)
        {
            return new DocRef
            {
                ZingzeuId = string.Format("{0:X}", wordId)
            };
        }

        public static string ToWordName(DocRef docRef)
        {
            return string.Format("words/{0}", DocRefs.Encode(docRef));
        }

        public static int ToWordListId(string name)
        {
            var outs = new RouteValueDictionary();
            if (!new TemplateMatcher(WordListResourceNameTemplate, null).TryMatch("/" + name, outs))
            {
                throw new ArgumentException($"{name} is not a WordList resource name.");
            }
            return int.Parse((string)outs["wordList"]);
        }

        public static string ToWordListName(int id)
        {
            return string.Format("wordLists/{0}", id);
        }

    }
}
