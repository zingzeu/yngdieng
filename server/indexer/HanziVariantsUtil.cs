using System.IO;
using System.Collections.Generic;

namespace Yngdieng.Indexer
{
  public sealed class HanziVariantsUtil
  {

    private readonly string dataPath;
    private Dictionary<string, HashSet<string>> variants;

    public HanziVariantsUtil(string dataPath)
    {
      this.dataPath = dataPath;
      this.variants = LoadKanjiVariants();
    }

    public string[] GetFanoutVariants(string[] hanziList)
    {
      var outputSet = new HashSet<string>();
      foreach (var hanzi in hanziList)
      {
        outputSet.Add(hanzi);
        if (variants.ContainsKey(hanzi))
        {
          outputSet.UnionWith(variants[hanzi]);
        }
      }
      var output = new List<string>();
      foreach (var h in outputSet)
      {
        output.Add(h);
      }
      return output.ToArray();
    }

    private Dictionary<string, HashSet<string>> LoadKanjiVariants()
    {
      var result = new Dictionary<string, HashSet<string>>();
      void AddVariant(string a, string b)
      {
        if (!result.ContainsKey(a))
        {
          result.Add(a, new HashSet<string>());
        }
        result[a].Add(b);
      }
      void LoadOneFile(string filename)
      {
        var lines = File.ReadAllLines(filename);
        foreach (var line in lines)
        {
          var tokens = line.Split('\t');
          var chars = new List<string>();
          chars.Add(tokens[0]);
          foreach (var other in tokens[1].Split(' '))
          {
            chars.Add(tokens[1]);
          }
          for (int i = 0; i < chars.Count; ++i)
          {
            for (int j = 0; j < chars.Count; ++j)
            {
              AddVariant(chars[i], chars[j]);
              AddVariant(chars[j], chars[i]);
            }
          }
        }
      }
      LoadOneFile(Path.Combine(this.dataPath, "opencc_data_dictionary/TSCharacters.txt"));
      LoadOneFile(Path.Combine(this.dataPath, "opencc_data_dictionary/STCharacters.txt"));
      LoadOneFile(Path.Combine(this.dataPath, "opencc_data_dictionary/HKVariants.txt"));
      LoadOneFile(Path.Combine(this.dataPath, "opencc_data_dictionary/JPVariants.txt"));
      LoadOneFile(Path.Combine(this.dataPath, "opencc_data_dictionary/TWVariants.txt"));
      return result;
    }
  }
}
