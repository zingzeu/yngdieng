extern alias zingzeudata;

using System;
using System.Collections.Generic;
using System.Linq;
using zingzeudata.ZingzeuData.Yngping;
namespace Yngdieng.Backend.TextToSpeech
{
    /// <summary>
    /// 将榕拼映射为音频文件的 utility code.
    /// </summary>
    public static class YngpingTtsUtil
    {
        private static Dictionary<string, string> ConsonantAudioMapping =
            new Dictionary<string, string>{
                {"01", "b"},
                {"02", "p"},
                {"03", "m"},
                {"04", "d"},
                {"05", "t"},
                {"07", "n"},
                {"06", "l"},
                {"08", "z"},
                {"09", "c"},
                {"10", "s"},
                {"11", "g"},
                {"12", "k"},
                {"13", "h"},
                {"14", "ng"},
                {"15", ""},
            };

        private static Dictionary<string, string> ToneAudioMapping =
            new Dictionary<string, string>(){
                {"01", "55"},  // 陰平
                {"02", "33"},  // 上聲
                {"03", "213"}, // 陰去
                {"04", "24"},  // 陰入
                {"05", "53"},  // 陽平
                {"07", "242"}, // 陽去
                {"08", "5"},   // 陽入
            };

        private static Dictionary<string, string[]> FinalAudioMapping =
            new Dictionary<string, string[]>{{"01", new string[]{"ung", "oung"}},
                                             {"02", new string[]{"ua"}},
                                             {"03", new string[]{"yong"}},
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

        private static readonly int MaxFallbackCount = 100;
        private static readonly IReplacementRule[] ReplacementRules = new IReplacementRule[] {
            new NgReplacementRule(),
            new SandhiSpecialToneAsNormalRule(),
            new SandhiToneReplacementRule(),
            new SandhiInitialReplacementRule()
        };

        private static Dictionary<string, string> AudioMappingCache = new Dictionary<string, string>();

        private static Dictionary<string, string> SyllableMappings =
            new Dictionary<string, string>();

        // 松韵调 (会发生变韵的声调)
        private static HashSet<string> AltTones = new HashSet<string> { "03", "04", "07" };
        // 入声调
        private static HashSet<string> AbruptTones = new HashSet<string> { "04", "08" };

        /// <summary>
        /// 生成所有 (音节, 音频名) 的字典
        /// </summary>
        public static void GenerateMappings()
        {
            // 林圜音频
            foreach (var (consonantCode, consonant) in ConsonantAudioMapping)
            {
                foreach (var (finalCode, finals) in FinalAudioMapping)
                {
                    foreach (var (toneCode, tone) in ToneAudioMapping)
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
            // TODO: 补充音频
            return;
        }

        public static bool IsPronounceable(string yngping)
        {
            var syllables = yngping.Split().Select(s => s.Trim().ToLowerInvariant());
            var audioCodes = syllables.Select(SyllableToAudio);
            return !audioCodes.Any(a => string.IsNullOrEmpty(a));
        }

        public static string[]? YngpingToAudioCodes(string yngping)
        {
            var syllables = yngping.Split().Select(s => s.Trim().ToLowerInvariant());
            var audioCodes = syllables.Select(SyllableToAudio);
            if (audioCodes.Any(a => string.IsNullOrEmpty(a)))
            {
                return null;
            }
            return audioCodes.ToArray();
        }

        /// <summary>
        /// 将榕拼音节转换为对应音频文件名。
        /// </summary>
        /// <returns>Empty string if none is matched</returns>
        public static string SyllableToAudio(string yngpingSyllable)
        {
            if (AudioMappingCache.ContainsKey(yngpingSyllable))
            {
                return AudioMappingCache[yngpingSyllable];
            }

            if (SyllableMappings.Count == 0)
            {
                GenerateMappings();
            }

            if (SyllableMappings.ContainsKey(yngpingSyllable))
            {
                AudioMappingCache[yngpingSyllable] = SyllableMappings[yngpingSyllable];
                return SyllableMappings[yngpingSyllable];
            }

            var result = FindAudioWithFallback(yngpingSyllable);
            AudioMappingCache[yngpingSyllable] = result;
            return result;
        }

        private static string FindAudioWithFallback(string yngpingSyllable)
        {
            var fallbacks = new HashSet<string>();
            fallbacks.Add(yngpingSyllable);
            while (fallbacks.Count < MaxFallbackCount)
            {
                var foundNew = false;
                foreach (var rule in ReplacementRules)
                {
                    var newSyllables = new List<string>();
                    foreach (var syllable in fallbacks)
                    {
                        var parseResult = Yngping0_4_0Validator.ParseHukziuSyllable(syllable);
                        if (parseResult == null)
                        {
                            continue;
                        }
                        var (initial, final, tone) = parseResult.Value;

                        var output = rule.GenerateFallbacks(initial, final, tone);
                        foreach (var newSyllable in output)
                        {
                            if (!fallbacks.Contains(newSyllable))
                            {
                                if (SyllableMappings.ContainsKey(newSyllable))
                                {
                                    return SyllableMappings[newSyllable];
                                }
                                foundNew = true;
                                newSyllables.Add(newSyllable);
                            }
                        }
                    }
                    foreach (var newSyllable in newSyllables)
                    {
                        fallbacks.Add(newSyllable);
                    }
                    if (fallbacks.Count >= MaxFallbackCount) { break; }
                }
                if (!foundNew)
                {
                    break;
                }
            }
            return string.Empty;
        }
    }

    interface IReplacementRule
    {
        IEnumerable<string> GenerateFallbacks(string initial, string final, string tone);
    }

    internal sealed class NgReplacementRule : IReplacementRule
    {
        public IEnumerable<string> GenerateFallbacks(string initial, string final, string tone)
        {
            if (initial == "ng" && final == "")
            {
                return new string[] { "ing" + tone };
            }
            return Enumerable.Empty<string>();
        }
    }

    internal sealed class SandhiToneReplacementRule : IReplacementRule
    {
        public IEnumerable<string> GenerateFallbacks(string initial, string final, string tone)
        {
            if (final.EndsWith("h") || final.EndsWith("k"))
            {
                var finalWithoutHK = final.Substring(0, final.Length - 1);
                return new string[] { initial + finalWithoutHK + tone };
            }
            return Enumerable.Empty<string>();
        }
    }

    internal sealed class SandhiSpecialToneAsNormalRule : IReplacementRule
    {
        public IEnumerable<string> GenerateFallbacks(string initial, string final, string tone)
        {
            if (tone == "24" && !(final.EndsWith("h") || final.EndsWith("k")) && !(final.EndsWith("ng")))
            {
                return new string[] { initial + final + "k" + "24" };
            }
            if (tone == "21")
            {
                return new string[] { initial + final + "213" };
            }
            return Enumerable.Empty<string>();
        }
    }

    internal sealed class SandhiInitialReplacementRule : IReplacementRule
    {
        public IEnumerable<string> GenerateFallbacks(string initial, string final, string tone)
        {
            // w -> m
            if (initial == "w")
            {
                return new string[] { "m" + final + tone };
            }
            // j -> z
            if (initial == "j")
            {
                return new string[] { "z" + final + tone };
            }
            // nj -> n
            if (initial == "nj")
            {
                return new string[] { "n" + final + tone };
            }
            return Enumerable.Empty<string>();
        }
    }
}
