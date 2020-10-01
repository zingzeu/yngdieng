using System;
using System.Collections.Generic;
using ZingzeuData.Yngping;

namespace Yngdieng.Backend.TextToSpeech
{
    /// <summary>
    /// 将榕拼映射为音频文件的 utility code.
    /// </summary>
    public static class YngpingTtsUtil
    {
        private static Dictionary<string, string> ConsonantAudioMapping =
            new Dictionary<string, string>{
                {"b", "01"},
                {"p", "02"},
                {"m", "03"},
                {"d", "04"},
                {"t", "05"},
                {"n", "07"},
                {"l", "06"},
                {"z", "08"},
                {"c", "09"},
                {"s", "10"},
                {"g", "11"},
                {"k", "12"},
                {"ng", "14"},
                {"", "15"},
                {"h", "13"},
                {"w", "03"}, // as m
                {"j", "08"}, // as z
                {"nj", "07"} // as n
            };

        private static Dictionary<string, string> ToneAudioMapping =
            new Dictionary<string, string>(){
                {"55", "01"},  // 陰平
                {"33", "02"},  // 上聲
                {"213", "03"}, // 陰去
                {"24", "04"},  // 陰入
                {"53", "05"},  // 陽平
                {"242", "07"}, // 陽去
                {"5", "08"},   // 陽入
                {"21", "03"},  // 半陰去
                // {"24","07"}    // 半陽去
            };

        private static Dictionary<string, string[]> FinalAudioMapping =
            new Dictionary<string, string[]>{{"01", new string[]{"ung", "oung"}},
                                             {"02", new string[]{"ua"}},
                                             {"03", new string[]{"yo"}},
                                             {"04", new string[]{"iu"}},
                                             {"05", new string[]{"ang"}},
                                             {"06", new string[]{"ai"}},
                                             {"07", new string[]{"a"}},
                                             {"08", new string[]{"ing", "eing"}},
                                             {"09", new string[]{"uang"}},
                                             {"10", new string[]{"o", "oo"}},
                                             {"11", new string[]{"y", "eoy"}},
                                             {"13", new string[]{"ui"}},
                                             {"14", new string[]{"u", "ou"}},
                                             {"15", new string[]{"eing", "aing"}},
                                             {"16", new string[]{"uong"}},
                                             {"19", new string[]{"yng", "eoyng"}},
                                             {"20", new string[]{"oung", "ooung"}},
                                             {"21", new string[]{"i", "ei"}},
                                             {"22", new string[]{"eoyng", "ooyng"}},
                                             {"23", new string[]{"au"}},
                                             {"24", new string[]{"uo"}},
                                             {"25", new string[]{"e"}},
                                             {"26", new string[]{"yo"}},
                                             {"27", new string[]{"ie"}},
                                             {"28", new string[]{"iang"}},
                                             {"29", new string[]{"eoy", "ooy"}},
                                             {"30", new string[]{"eo"}},
                                             {"31", new string[]{"ieng"}},
                                             {"32", new string[]{"ia"}},
                                             {"34", new string[]{"uai"}},
                                             {"36", new string[]{"eu"}}};

        private static Dictionary<string, string> SyllableMappings =
            new Dictionary<string, string>();

        // 松韵调 (会发生变韵的声调)
        private static HashSet<string> AltTones = new HashSet<string> { "03", "04", "07" };
        private static HashSet<string> AbruptTones = new HashSet<string> { "04", "08" };

        /// <summary>
        /// 生成所有{音节, 音频名}的字典
        /// </summary>
        public static void GenerateMappings()
        {
            foreach (var (consonant, consonantCode) in ConsonantAudioMapping)
            {
                foreach (var (finalCode, finals) in FinalAudioMapping)
                {
                    foreach (var (tone, toneCode) in ToneAudioMapping)
                    {
                        string final = (finals.Length == 2 && AltTones.Contains(toneCode)) ? finals[1] : finals[0];
                        string syllableCode = consonantCode + finalCode + toneCode;
                        if (AbruptTones.Contains(toneCode))
                        {
                            if (final.EndsWith("ng"))
                            {
                                final = final.Substring(0, final.Length - 2);
                            }
                            SyllableMappings.TryAdd(consonant + final + "h" + tone, syllableCode);
                            SyllableMappings.TryAdd(consonant + final + "k" + tone, syllableCode);
                        }
                        else
                        {
                            SyllableMappings.TryAdd(consonant + final + tone, syllableCode);
                        }
                    }
                }
            }
            return;
        }

        /// <summary>
        /// 将榕拼音节转换为对应音频文件名。
        /// </summary>
        /// <returns>Empty string if none is matched</returns>
        public static string SyllableToAudio(string yngpingSyllable)
        {
            if (SyllableMappings.Count == 0)
            {
                GenerateMappings();
            }
            if (SyllableMappings.ContainsKey(yngpingSyllable))
            {
                return SyllableMappings[yngpingSyllable];
            }
            // TODO: add extra rules
            return string.Empty;
        }
    }
}
