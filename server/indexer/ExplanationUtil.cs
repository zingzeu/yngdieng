extern alias zingzeudata;
using System;
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

    private static Explanation ConvertExplanation(
        zingzeudata.ZingzeuData.Models.Explanation explanation)
    {
      return Explanation.Parser.ParseFrom(explanation.ToByteArray());
    }
  }
}
