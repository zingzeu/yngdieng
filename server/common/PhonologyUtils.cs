using System.Collections.Generic;
using Yngdieng.Protos;

namespace Yngdieng.Common
{
    public static class PhonologyUtils
    {
        private static readonly IDictionary<Initial, string> InitialToHanzi = new Dictionary<Initial, string>()
        {
          { Initial.L, "柳" },
          { Initial.B, "邊" },
          { Initial.G, "求" },
          { Initial.K, "氣" },
          { Initial.D, "低" },
          { Initial.P, "波" },
          { Initial.T, "他" },
          { Initial.Z, "曾" },
          { Initial.N, "日" },
          { Initial.S, "時" },
          { Initial.None, "鶯" },
          { Initial.M, "蒙" },
          { Initial.Ng, "語" },
          { Initial.C, "出" },
          { Initial.H, "喜" },
        };


        private static readonly IDictionary<string, Initial> HanziToInitial =
          InitialToHanzi.Reverse();

        private static readonly IDictionary<Final, string> FinalToHanzi = new Dictionary<Final, string>()
        {
          { Final.Ung, "春" },
          { Final.Ua, "花" },
          { Final.Yong, "香" },
          { Final.Iu, "秋" },
          { Final.Ang, "山" },
          { Final.Ai, "開" },
          { Final.A, "嘉" },
          { Final.Ing, "賓" },
          { Final.Uang, "歡" },
          { Final.O, "歌" },
          { Final.Y, "須" },
          { Final.Uoi, "杯" },
          { Final.U, "孤" },
          { Final.Eing, "燈" },
          { Final.Uong, "光" },
          { Final.Ui, "輝" },
          { Final.Ieu, "燒" },
          { Final.Yng, "銀" },
          { Final.Ong, "釭" },
          { Final.I, "之" },
          { Final.Oeng, "東" },
          { Final.Au, "郊" },
          { Final.Uo, "過" },
          { Final.E, "西" },
          { Final.Io, "橋" },
          { Final.Ie, "雞" },
          { Final.Iang, "聲" },
          { Final.Oey, "催" },
          { Final.Oe, "初" },
          { Final.Ieng, "天" },
          { Final.Ia, "奇" },
          { Final.Uai, "歪" },
          { Final.Eu, "溝" },
        };

        private static readonly IDictionary<string, Final> HanziToFinal =
          FinalToHanzi.Reverse();

        private static readonly IDictionary<Tone, string> ToneToHanzi = new Dictionary<Tone, string>()
        {
          { Tone.UpLevel, "上平" },
          { Tone.UpUp, "上上" },
          { Tone.UpFalling, "上去" },
          { Tone.UpAbrupt, "上入" },
          { Tone.DownLevel, "下平" },
          { Tone.DownFalling, "下去" },
          { Tone.DownAbrupt, "下入" }
        };

        private static readonly IDictionary<string, Tone> HanziToTone =
          ToneToHanzi.Reverse();

        public static Initial GetInitialFromString(string s)
        {
            HanziToInitial.TryGetValue(s, out var result);
            return result;
        }

        public static Final GetFinalFromString(string s)
        {
            HanziToFinal.TryGetValue(s, out var result);
            return result;
        }

        public static Tone GetToneFromString(string s)
        {
            HanziToTone.TryGetValue(s, out var result);
            return result;
        }

        public static string ToHanzi(Initial initial, Final final, Tone tone)
        {
            return InitialToHanzi[initial] + FinalToHanzi[final] + " " + ToneToHanzi[tone];
        }

#pragma warning disable CS8714 // The type cannot be used as type parameter in the generic type or method. Nullability of type argument doesn't match 'notnull' constraint.
        private static Dictionary<TValue, TKey> Reverse<TKey, TValue>(this IDictionary<TKey, TValue> source)
        {
            var dictionary = new Dictionary<TValue, TKey>();
            foreach (var entry in source)
            {
                if (!dictionary.ContainsKey(entry.Value))
                    dictionary.Add(entry.Value, entry.Key);
            }
            return dictionary;
        }
#pragma warning restore CS8714

    }
}
