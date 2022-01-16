using System;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Yngdieng.Admin.V1.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{
    public static class ResourceNames
    {
        private static readonly RouteTemplate WordResourceNameTemplate = TemplateParser.Parse("words/{word}");
        private static readonly RouteTemplate PronResourceNameTemplate = TemplateParser.Parse("words/{word}/prons/{pron}");

        public static string ToWordName(WordRef word)
        {
            return string.Format("words/{0:X}", word.WordId);
        }

        public static WordRef ToWordRef(string name)
        {
            var outs = new RouteValueDictionary();
            if (!new TemplateMatcher(WordResourceNameTemplate, null).TryMatch("/" + name, outs))
            {
                throw new ArgumentException($"{name} is not a Word resource name.");
            }
            return new WordRef
            {
                WordId = int.Parse((string)outs["word"], System.Globalization.NumberStyles.HexNumber),
            };
        }

        public static string ToPronName(PronRef pron)
        {
            return string.Format("words/{0:X}/prons/{1}", pron.WordId, pron.PronId);
        }

        public static PronRef ToPronRef(string name)
        {
            var outs = new RouteValueDictionary();
            if (!new TemplateMatcher(PronResourceNameTemplate, null).TryMatch("/" + name, outs))
            {
                throw new ArgumentException($"{name} is not a Pron resource name.");
            }
            return new PronRef
            {
                WordId = int.Parse((string)outs["word"], System.Globalization.NumberStyles.HexNumber),
                PronId = int.Parse((string)outs["pron"])
            };
        }
    }
}
