﻿using System;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Yngdieng.Admin.V1.Protos;

namespace Yngdieng.Backend.Services.Frontend
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
