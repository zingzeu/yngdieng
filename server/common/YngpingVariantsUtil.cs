using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Yngdieng.Common
{
  public static class YngpingVariantsUtil
  {

    public static string[] GenerateYngpingVariants(string canonical)
    {
      var tmp = new YngpingWord(canonical);
      tmp.Transform(@"^\{?([a-z]+)([0-5]*)\}?$", match => $"{match.Groups[1]}");
      // 首字母缩写
      //tmp.Derive(@"^([gkhlnmbpdtzcs]|ng)[aoeiuy]+(ng|h|k)?$", match => $"{match.Groups[1]}");
      tmp.Derive(@"^([lnm]|ng).+$", match => $"{match.Groups[1]}");

      // ——————模糊音——————
      // 普通話拼音模糊音
      tmp.Derive(@"y", match => $"v");
      tmp.Derive(@"au", match => $"ao");
      tmp.Derive(@"yo", match => $"ue");
      tmp.Derive(@"^yo", match => $"yue");
      tmp.Derive(@"^yong", match => $"yuan");
      tmp.Derive(@"ieng", match => $"ian");
      tmp.Derive(@"oung", match => $"ong");
      tmp.Derive(@"yng", match => $"yun");
      tmp.Derive(@"iau", match => $"yao");
      // 普通話拼音的零声母辅音
      tmp.Derive(@"^ia", match => $"ya");
      tmp.Derive(@"^i", match => $"yi");
      tmp.Derive(@"^iu", match => $"you");
      tmp.Derive(@"^y", match => $"yu");
      tmp.Derive(@"^ie", match => $"ye");
      // 鼻音韵尾简化
      tmp.Derive(@"ang", match => $"an");
      tmp.Derive(@"ing", match => $"in");
      tmp.Derive(@"yng", match => $"vn");
      // 戚林八音音系
      tmp.Derive(@"eing", match => $"eng");
      tmp.Derive(@"yo", match => $"io");
      tmp.Derive(@"iu", match => $"ieu");
      tmp.Derive(@"ui", match => $"uoi");
      tmp.Derive(@"oey", match => $"oi");
      tmp.Derive(@"ooy", match => $"oi");
      // 入聲模糊音
      tmp.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}");
      tmp.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}h");
      tmp.Derive(@"^(.+)[hk]$", match => $"{match.Groups[1]}k");
      // 类化音模糊音（大部分是）
      tmp.Derive(@"^ui", match => $"wei");
      tmp.Derive(@"w", match => $"b");
      tmp.Derive(@"^ua", match => $"wa");
      tmp.Derive(@"^uai", match => $"wai");
      tmp.Derive(@"^u", match => $"wu");
      tmp.Derive(@"^uo", match => $"wo");
      tmp.Derive(@"j", match => $"z");
      tmp.Derive(@"j", match => $"c");
      tmp.Derive(@"zi", match => $"ji");
      tmp.Derive(@"ci", match => $"qi");
      tmp.Derive(@"si", match => $"xi");
      tmp.Derive(@"zy", match => $"ju");
      tmp.Derive(@"cy", match => $"qu");
      tmp.Derive(@"sy", match => $"xu");
      tmp.Derive(@"nj", match => $"z");
      tmp.Derive(@"nj", match => $"c");
      tmp.Derive(@"nj", match => $"j");
      tmp.Derive(@"nj", match => $"n");
      // oo的模糊音
      tmp.Derive(@"oo", match => $"o");
      tmp.Derive(@"ooung", match => $"aung");
      tmp.Derive(@"oouk", match => $"auk");
      tmp.Derive(@"ooyng", match => $"ayng");
      tmp.Derive(@"ooyk", match => $"ayk");
      tmp.Derive(@"ooy", match => $"oey");
      tmp.Derive(@"oeyng", match => $"oeng");
      tmp.Derive(@"oeyng", match => $"oyng");
      // 泥來混
      tmp.Derive(@"^[ln](.*)$", match => $"l{match.Groups[1]}");
      tmp.Derive(@"^[nl](.*)$", match => $"n{match.Groups[1]}");
      //  新老派 城乡 口音差异
      tmp.Derive(@"ooy", match => $"uai");
      tmp.Derive(@"yo", match => $"yoe");
      tmp.Derive(@"za", match => $"zia");
      tmp.Derive(@"ca", match => $"cia");
      tmp.Derive(@"ja", match => $"ia");
      // 新老派、城乡口音差异的普通话拼音模糊音
      tmp.Derive(@"za", match => $"jia");
      tmp.Derive(@"ca", match => $"qia");
      tmp.Derive(@"ja", match => $"ya");
      tmp.Derive(@"nja", match => $"ya");
      tmp.Derive(@"nja", match => $"ia");
      // TODO(ztl8702/yngping-rime#58):
      // 关于eo的模糊音，以后会把这几行去掉
      tmp.Derive(@"oeyng", match => $"eong");
      tmp.Derive(@"oeyng", match => $"eoyng");
      tmp.Derive(@"oeyng", match => $"oyeng");
      tmp.Derive(@"oeyng", match => $"eyong");
      tmp.Derive(@"oe", match => $"eo");

      return tmp.GetAllVariants().ToArray();
    }
  }

  sealed class YngpingWord
  {
    string[] canonicalSyllables;
    List<string[]> derivatives = new List<string[]>();

    public YngpingWord(string canonical)
    {
      canonicalSyllables = canonical.Split(' ');
    }

    public void Transform(string pattern, MatchEvaluator evaluator)
    {
      canonicalSyllables = canonicalSyllables.Select(s =>
          Regex.Replace(s, pattern, evaluator)
      ).ToArray();
    }

    public void Derive(string pattern, MatchEvaluator evaluator)
    {
      derivatives.Add(
          canonicalSyllables.Select(s =>
              Regex.Replace(s, pattern, evaluator))
          .ToArray());
    }

    public IEnumerable<string> GetAllVariants()
    {
      var tmp = new List<string>();
      tmp.Add(string.Join(" ", canonicalSyllables));
      tmp.AddRange(derivatives.Select(w => string.Join(" ", w)));
      return tmp.Distinct();
    }
  }
}
