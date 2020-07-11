using System;
using System.Collections.Generic;
using Yngdieng.Protos;
using System.Linq;

namespace Yngdieng.Common
{
    public static class FoochowRomanziedUtils
    {
        private static readonly string[] FrInitials = new string[]{
            "l", "b", "g", "k", "d", "p", "t", "c", "n", "s", "", "m", "ng", "ch", "h"};

        private static readonly Initial[] FrInitialsProto = new Initial[]{Initial.L,
                                                                          Initial.B,
                                                                          Initial.G,
                                                                          Initial.K,
                                                                          Initial.D,
                                                                          Initial.P,
                                                                          Initial.T,
                                                                          Initial.Z,
                                                                          Initial.N,
                                                                          Initial.S,
                                                                          Initial.None,
                                                                          Initial.M,
                                                                          Initial.Ng,
                                                                          Initial.C,
                                                                          Initial.H};

        private static readonly string[] FrInitialSorted =
            FrInitials.OrderByDescending(s => s.Length).ToArray();

        private static readonly IDictionary<Final, string[]> FrFinals =
            new Dictionary<Final, string[]>(){
                {Final.Ung, new string[]{"ŭng", "ūng", "óng", "ók", "ùng", "ông", "ŭk"}},
                {Final.Ua, new string[]{"uă", "uā", "uá", "uáh", "uà", "uâ", "uăh"}},
                {Final.Yong, new string[]{"iŏng", "iōng", "ióng", "iók", "iòng", "iông", "iŏk"}},
                {Final.Iu, new string[]{"iŭ", "iū", "éu", "éuh", "iù", "êu", null}},
                {Final.Ang, new string[]{"ăng", "āng", "áng", "ák", "àng", "âng", "ăk"}},
                {Final.Ai, new string[]{"ăi", "āi", "ái", "áih", "ài", "âi", "ăih"}},
                {Final.A, new string[]{"ă", "ā", "á", "áh", "à", "â", "ăh"}},
                {Final.Ing, new string[]{"ĭng", "īng", "éng", "ék", "ìng", "êng", "ĭk"}},
                {Final.Uang, new string[]{"uăng", "uāng", "uáng", "uák", "uàng", "uâng", "uăk"}},
                {Final.O, new string[]{"ŏ̤", "ō̤", "ó̤", "ó̤h", "ò̤", "ô̤", "ŏ̤h"}},
                {Final.Y, new string[]{"ṳ̆", "ṳ̄", "é̤ṳ", "é̤ṳh", "ṳ̀", "ê̤ṳ", "ṳ̆h"}},
                {Final.Uoi, new string[]{"uŏi", "uōi", "uói", "uóih", "uòi", "uôi", null}},
                {Final.U, new string[]{"ŭ", "ū", "ó", "óh", "ù", "ô", "ŭh"}},
                {Final.Eing, new string[]{"ĕng", "ēng", "áing", "áik", "èng", "âing", "ĕk"}},
                {Final.Uong, new string[]{"uŏng", "uōng", "uóng", "uók", "uòng", "uông", "uŏk"}},
                {Final.Ui, new string[]{"ŭi", "ūi", "ói", "óih", "ùi", "ôi", "ŭih"}},
                {Final.Ieu, new string[]{"iĕu", "iēu", "iéu", "iéuh", "ièu", "iêu", null}},
                {Final.Yng, new string[]{"ṳ̆ng", "ṳ̄ng", "é̤ṳng", "é̤ṳk", "ṳ̀ng", "ê̤ṳng", "ṳ̆k"}},
                {Final.Ong, new string[]{"ŏng", "ōng", "áung", "áuk", "òng", "âung", "ŏk"}},
                {Final.I, new string[]{"ĭ", "ī", "é", "éh", "ì", "ê", "ĭh"}},
                {Final.Oeng, new string[]{"ĕ̤ng", "ē̤ng", "áe̤ng", "áe̤k", "è̤ng", "âe̤ng", "ĕ̤k"}},
                {Final.Au, new string[]{"ău", "āu", "áu", "áuh", "àu", "âu", "ăuh"}},
                {Final.Uo, new string[]{"uŏ", "uō", "uó", "uóh", "uò", "uô", "uŏh"}},
                {Final.E, new string[]{"ă̤", "ā̤", "á̤", "á̤h", "à̤", "â̤", "ă̤h"}},
                {Final.Io, new string[]{"iŏ", "iō", "ió", "ióh", "iò", "iô", "iŏh"}},
                {Final.Ie, new string[]{"iĕ", "iē", "ié", "iéh", "iè", "iê", "iĕh"}},
                {Final.Iang, new string[]{"iăng", "iāng", "iáng", "iák", "iàng", "iâng", "iăk"}},
                {Final.Oey, new string[]{"ŏi", "ōi", "ó̤i", "ó̤ih", "òi", "ô̤i", "ŏih"}},
                {Final.Oe, new string[]{"ĕ̤", "ē̤", "áe̤", "áe̤h", "è̤", "âe̤", "ĕ̤h"}},
                {Final.Ieng, new string[]{"iĕng", "iēng", "iéng", "iék", "ièng", "iêng", "iĕk"}},
                {Final.Ia, new string[]{"iă", "iā", "iá", "iáh", "ià", "iâ", "iăh"}},
                {Final.Uai, new string[]{"uăi", "uāi", "uái", "uáih", "uài", "uâi", "uăih"}},
                {Final.Eu, new string[]{"ĕu", "ēu", "áiu", "áiuh", "èu", "âiu", "ĕuh"}},
            };

        private static readonly IDictionary<string, (Final, Tone)> FrFinalsMapping =
            GetFrFinalsMapping();

        private static IDictionary<string, (Final, Tone)> GetFrFinalsMapping()
        {
            Tone IndexToTone(int toneNumber)
            {
                switch (toneNumber)
                {
                case 0:
                    return Tone.UpLevel;
                case 1:
                    return Tone.UpUp;
                case 2:
                    return Tone.UpFalling;
                case 3:
                    return Tone.UpAbrupt;
                case 4:
                    return Tone.DownLevel;
                case 5:
                    return Tone.DownFalling;
                case 6:
                    return Tone.DownAbrupt;
                default:
                    throw new Exception("Unknown tone");
                }
            }

            var output = new Dictionary<string, (Final, Tone)>();
            foreach (var rime in FrFinals.Keys)
            {
                var subRimes = FrFinals[rime];
                for (int i = 0; i < subRimes.Length; ++i)
                {
                    if (subRimes[i] != null)
                    {
                        if (output.ContainsKey(subRimes[i]))
                        {
                            throw new Exception($"{subRimes[i]} already exists");
                        }
                        output[subRimes[i]] = (rime, IndexToTone(i));
                    }
                }
            }
            return output;
        }

        public static(Initial, Final, Tone) Parse(string buc)
        {
            string remaining = buc.Normalize().Trim().ToLower();

            Initial? initial = null;
            // Try parse initial
            foreach (var i in FrInitialSorted)
            {
                if (remaining.StartsWith(i))
                {
                    initial = FrInitialsProto[Array.IndexOf(FrInitials, i)];
                    remaining = remaining.Substring(i.Length);
                    break;
                }
            }

            if (initial == null)
            {
                throw new Exception($"{buc} is not a valid Foochow Romanized syllable");
            }

            // Try parse final
            if (FrFinalsMapping.ContainsKey(remaining))
            {
                (var f, var tone) = FrFinalsMapping[remaining];
                return (initial.Value, f, tone);
            }
            else
            {
                throw new Exception(
                    $"{buc} is not a valid Foochow Romanized Syllable; {remaining} not found in finals.");
            }
        }

        public static string ToBucString(Initial i, Final f, Tone t)
        {
            int ToneToIndex(Tone t)
            {
                switch (t)
                {
                case Tone.UpLevel:
                    return 0;
                case Tone.UpUp:
                    return 1;
                case Tone.UpFalling:
                    return 2;
                case Tone.UpAbrupt:
                    return 3;
                case Tone.DownLevel:
                    return 4;
                case Tone.DownFalling:
                    return 5;
                case Tone.DownAbrupt:
                    return 6;
                default:
                    throw new Exception("Unknown tone");
                }
            }
            return FrInitials[Array.IndexOf(FrInitialsProto, i)] + FrFinals [f]
                                                                   [ToneToIndex(t)];
        }
    }
}
