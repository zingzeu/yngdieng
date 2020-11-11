using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Yngdieng.Common
{
    public static class YngpingVariantsUtil
    {

        public static string[] GenerateYngpingVariants(string canonical)
        {
            var word = new YngpingWord(canonical);
            word.Transform(@"^\{?([a-z]+)([0-5]*)\}?$", match => $"{match.Groups[1]}");
            // 首字母缩写
            //tmp.Derive(@"^([gkhlnmbpdtzcs]|ng)[aoeiuy]+(ng|h|k)?$", match => $"{match.Groups[1]}");
            word.Derive(@"^([lnm]|ng).+$", match => $"{match.Groups[1]}");

            // ——————模糊音——————
            // 普通話拼音模糊音
            word.Derive(@"y", match => $"v");
            word.Derive(@"au", match => $"ao");
            word.Derive(@"yo", match => $"ue");
            word.Derive(@"^yo", match => $"yue");
            word.Derive(@"^yong", match => $"yuan");
            word.Derive(@"ieng", match => $"ian");
            word.Derive(@"oung", match => $"ong");
            word.Derive(@"yng", match => $"yun");
            word.Derive(@"iau", match => $"yao");
            // 普通話拼音的零声母辅音
            word.Derive(@"^ia", match => $"ya");
            word.Derive(@"^i", match => $"yi");
            word.Derive(@"^iu", match => $"you");
            word.Derive(@"^y", match => $"yu");
            word.Derive(@"^ie", match => $"ye");
            // 鼻音韵尾简化
            word.Derive(@"ang", match => $"an");
            word.Derive(@"ing", match => $"in");
            word.Derive(@"yng", match => $"vn");
            // 戚林八音音系
            word.Derive(@"eing", match => $"eng");
            word.Derive(@"yo", match => $"io");
            word.Derive(@"iu", match => $"ieu");
            word.Derive(@"ui", match => $"uoi");
            word.Derive(@"oey", match => $"oi");
            word.Derive(@"ooy", match => $"oi");
            // 入聲模糊音
            word.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}");
            word.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}h");
            word.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}k");
            // 类化音模糊音（大部分是）
            word.Derive(@"^ui", match => $"wei");
            word.Derive(@"w", match => $"b");
            word.Derive(@"^ua", match => $"wa");
            word.Derive(@"^uai", match => $"wai");
            word.Derive(@"^u", match => $"wu");
            word.Derive(@"^uo", match => $"wo");
            word.Derive(@"j", match => $"z");
            word.Derive(@"j", match => $"c");
            word.Derive(@"zi", match => $"ji");
            word.Derive(@"ci", match => $"qi");
            word.Derive(@"si", match => $"xi");
            word.Derive(@"zy", match => $"ju");
            word.Derive(@"cy", match => $"qu");
            word.Derive(@"sy", match => $"xu");
            word.Derive(@"nj", match => $"z");
            word.Derive(@"nj", match => $"c");
            word.Derive(@"nj", match => $"j");
            word.Derive(@"nj", match => $"n");
            // oo的模糊音
            word.Derive(@"oo", match => $"o");
            word.Derive(@"ooung", match => $"aung");
            word.Derive(@"oouk", match => $"auk");
            word.Derive(@"ooyng", match => $"ayng");
            word.Derive(@"ooyk", match => $"ayk");
            word.Derive(@"ooy", match => $"oey");
            word.Derive(@"oeyng", match => $"oeng");
            word.Derive(@"oeyng", match => $"oyng");
            // 泥來混
            word.Derive(@"^[ln](.*)$", match => $"l{match.Groups[1]}");
            word.Derive(@"^[nl](.*)$", match => $"n{match.Groups[1]}");
            // 新老派 城乡 口音差异
            word.Derive(@"ooy", match => $"uai");
            word.Derive(@"yo", match => $"yoe");
            word.Derive(@"za", match => $"zia");
            word.Derive(@"ca", match => $"cia");
            word.Derive(@"ja", match => $"ia");
            // 新老派、城乡口音差异的普通话拼音模糊音
            word.Derive(@"za", match => $"jia");
            word.Derive(@"ca", match => $"qia");
            word.Derive(@"ja", match => $"ya");
            word.Derive(@"nja", match => $"ya");
            word.Derive(@"nja", match => $"ia");
            // TODO(ztl8702/yngping-rime#58):
            // 关于eo的模糊音，以后会把这几行去掉
            word.Derive(@"oeyng", match => $"eong");
            word.Derive(@"oeyng", match => $"eoyng");
            word.Derive(@"oeyng", match => $"oyeng");
            word.Derive(@"oeyng", match => $"eyong");
            word.Derive(@"oe", match => $"eo");

            return word.GetAllVariants().ToArray();
        }
    }

    sealed class YngpingWord
    {
        string canonicalSyllables;
        List<string> derivatives = new List<string>();

        public YngpingWord(string canonical)
        {
            canonicalSyllables = canonical;
            derivatives.Add(canonical);
        }

        public void Transform(string pattern, MatchEvaluator evaluator)
        {
            var newProns = derivatives.Select(
                pron => string.Join(' ', pron.Split(' ').Select(s =>
                 Regex.Replace(s, pattern, evaluator)
            ))).ToList();
            derivatives.Clear();
            derivatives.AddRange(newProns);
        }

        public void Derive(string pattern, MatchEvaluator evaluator)
        {
            var newProns =
                derivatives
                .Select(pron => string.Join(' ', pron.Split(' ').Select(s =>
                     Regex.Replace(s, pattern, evaluator)
                ))).ToList();
            derivatives.AddRange(newProns);
            derivatives = derivatives.Distinct().ToList();
        }

        public IEnumerable<string> GetAllVariants()
        {
            var tmp = new List<string>();
            tmp.Add(canonicalSyllables);
            tmp.AddRange(derivatives);
            tmp.AddRange(derivatives.Select(w => string.Join("", w.Split(' '))));
            return tmp.Distinct();
        }
    }
}
