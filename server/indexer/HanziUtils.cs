using System;
using Yngdieng.Protos;
using System.Collections.Generic;

namespace Yngdieng.Common
{
    public static class HanziUtils
    {
        public static Hanzi StringToHanziProto(string hanzi)
        {
            if (HasIDS(hanzi))
            {
                return new Hanzi { Ids = hanzi };
            }
            else
            {
                return new Hanzi { Regular = hanzi };
            }
        }

        public static bool HasIDS(string hanzi)
        {
            foreach (var c in GetUnicodeCodePoints(hanzi))
            {
                if (0x2ff0 <= c && c <= 0x2fff)
                {
                    return true;
                }
            }
            return false;
        }

        public static int[] GetUnicodeCodePoints(string input)
        {
            var output = new List<int>();
            for (var i = 0; i < input.Length; i += char.IsSurrogatePair(input, i) ? 2 : 1)
            {
                var codepoint = char.ConvertToUtf32(input, i);
                output.Add(codepoint);
            }
            return output.ToArray();
        }
    }
}