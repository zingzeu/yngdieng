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
                                             {"03", new string[]{"io"}},
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
                                             {"20", new string[]{"oung", "aung"}},
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
            foreach(var (consonant, consonantId) in ConsonantAudioMapping)
            {
                foreach(var (finalId, finals) in FinalAudioMapping)
                {
                    foreach(var (toneId, tone) in ToneAudioMapping) 
                    {
                        string audioFileName = consonantId + finalId + toneId;
                        if (finals.Length == 1 || !AltTones.Contains(toneId))
                        {   
                            string syllable = consonant + finals[0] + tone;
                        }
                        else
                        {
                            string syllable = consonant + finals[1] + tone;
                        }
                        WholeMappings.Add(syllable, AudioFileName);
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
            string audioFileName = "";
            if (SyllableMappings.TryGetValue(yngpingSyllable, audioFileName))
            {
                return audioFileName;    
            }

            // TODO: add extra rules
            var (initial, final, tone) =
                Yngping0_4_0Validator.TryParseHukziuSyllable(yngpingSyllable);
            if (tone == "21" && SyllableMappings.ContainsKey(initial + final + "213"))
            {
                return SyllableMappings[audioFileName];
            }
            return string.Empty;
        }




        /// <summary>
        /// 将榕拼音节转换为对应音频文件名.
        /// </summary>
        /// <returns>Empty string if unsupported</returns>
        public static string SyllableToAudioDeprecated(string yngpingSyllable)
        {
            var (initial, final, tone) =
                Yngping0_4_0Validator.TryParseHukziuSyllable(yngpingSyllable);
            if (!ConsonantAudioMapping.ContainsKey(initial) || !ToneAudioMapping.ContainsKey(tone))
            {
                return string.Empty;
            }
            var mappedFinal = MapFinal(final, tone);
            if (string.IsNullOrEmpty(mappedFinal))
            {
                return string.Empty;
            }
            return ConsonantAudioMapping[initial] + mappedFinal + ToneAudioMapping[tone];
        }

        /// <summary>
        /// 把榕拼韵母拆成韵腹和韵尾.
        /// </summary>
        private static (string, string) DestructureFinal(string final)
        {
            if (final.EndsWith('h') || final.EndsWith('k'))
            {
                return (final.Substring(0, final.Length - 1), final.Substring(final.Length - 1));
            }
            return (final, string.Empty);
        }

        private static string MapFinal(string final, string tone)
        {
            var (rime, coda) = DestructureFinal(final);
            var hasCoda = !string.IsNullOrEmpty(coda);
            string mappedTone = ToneAudioMapping[tone];
            if (AbruptTones.Contains(mappedTone) != hasCoda)
            {
                // 禁止用非入声韵代替入声
                // TODO: 其实可以开一些特例；比如说 buk21 用 bu21 代替完全可以.
                return string.Empty;
            }
            foreach (var (key, prons) in FinalAudioMapping)
            {

                // 入声韵
                if (hasCoda)
                {
                    if (AltTones.Contains(mappedTone))
                    {
                        if ((prons.Length == 2 &&
                             (prons[1] == rime || prons[1] == rime + "ng") /* 变韵韵母吻合 */) ||
                            (prons[0] == rime || prons[0] == rime + "ng"))
                        {
                            return key;
                        }
                    }
                    else if (prons[0] == rime || prons[0] == rime + "ng")
                    {
                        return key;
                    }
                }
                // 非入声
                else if (AltTones.Contains(mappedTone) &&

                         ((prons.Length == 2 && prons[1] == final /* 变韵韵母吻合 */) ||
                          (prons.Length == 1 && prons[0] == final)))
                {
                    return key;
                }
                else if (prons[0] == final)
                {
                    return key;
                }
            }
            return string.Empty;
        }
    }
}
