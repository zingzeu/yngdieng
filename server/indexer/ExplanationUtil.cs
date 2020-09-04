extern alias zingzeudata;
using System;
using System.Linq;
using ZingzeuData.Parser;
using ZingzeuData.Models;
using Google.Protobuf;

namespace Yngdieng.Indexer
{
  public static class ExplanationUtil
  {
    public static Explanation SafeParseExplanation(string rawExplanation)
    {
      try
      {
        return ConvertExplanation(FengExplanationParser.Parse(rawExplanation));
      }
      catch (Exception e)
      {
        Console.WriteLine($"{e.Message} {e.StackTrace}");
        return null;
      }
    }


    /// <summary>
    /// 
    /// </summary>
    public static string FlattenExplanation(Explanation explanation)
    {
      return string.Join(
        " ",
        explanation.Senses.SelectMany(s => FlattenExplanation(s))
          .Where(t => !string.IsNullOrWhiteSpace(t))
      );
    }

    private static string[] FlattenExplanation(Explanation.Types.Sense sense)
    {
      return (new string[] { sense.Text })
        .Concat(sense.ChildSenses
          .SelectMany(s => FlattenExplanation(s)))
        .ToArray();
    }

    private static Explanation ConvertExplanation(
        zingzeudata.ZingzeuData.Models.Explanation explanation)
    {
      return Explanation.Parser.ParseFrom(explanation.ToByteArray());
    }

  }
}
