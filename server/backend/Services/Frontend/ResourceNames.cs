using System;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Yngdieng.Admin.V1.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class ResourceNames
    {
        private static readonly RouteTemplate WordResourceNameTemplate = TemplateParser.Parse("words/{word}");

        public static string ToDocId(string name)
        {
            var outs = new RouteValueDictionary();
            if (!new TemplateMatcher(WordResourceNameTemplate, null).TryMatch("/" + name, outs))
            {
                throw new ArgumentException($"{name} is not a Word resource name.");
            }
            return (string)outs["word"];
        }
    }
}
