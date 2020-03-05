using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services
{
  public static class QueryParser
  {

    private static readonly Regex rAlphaNumeric = new Regex("^[a-zA-Z0-9]*$");

    /*
    * Query format
    *
    * "我" => HanziQuery
    *
    * "我 sort:phonology" => HanziQuery
    * 
    *  "i:l f:uang t:up_falling" => Phonology Query
    * 
    * "nguai" => Fuzzy query
    */

    /**
     * Converts a query from string to Query.
     * 
     * 1) If it is key-value pairs and all keys are recognized.
     *    => PhonologyQuery
     * 2) If it is alphanumberic => Fuzzy Pinyin Query
     * 3) Otherwise => Hanzi Query
     * 
     * @returns null if the query string is invalid;
     */
    public static Query? Parse(string text)
    {
      (var keyValuePairs, var remainingTokens) = ParseAsKeyValuePairs(text);

      var query = new Query();
      // Defaults
      query.SortBy = Query.Types.SortByMethod.InitialFinalTone;
      if (keyValuePairs.ContainsKey("sort"))
      {
        var sortMethod = keyValuePairs["sort"];
        var parsed = ParseSortByMethod(sortMethod);
        if (parsed != null)
        {
          query.SortBy = parsed ?? Query.Types.SortByMethod.SortByUnspecified;
        }
        else
        {
          return null;
        }
      }

      if (keyValuePairs.ContainsKey("historical"))
      {
          var value = keyValuePairs ["historical"]
                          .Trim()
                          .ToLowerInvariant();
          if (value == "yes" || value == "true")
          {
              query.AlwaysIncludeHistorical = true;
          }
          else if (value == "only")
          {
              query.AlwaysIncludeHistorical = true;
              query.OnlyHistorical = true;
          }
      }
      if (keyValuePairs.ContainsKey("i") || keyValuePairs.ContainsKey("f") || keyValuePairs.ContainsKey("t"))
      {
        var phonologyQuery = new Query.Types.PhonologyQuery();
        // Initial
        if (keyValuePairs.ContainsKey("i"))
        {
          var initial = PhonologyUtils.GetInitialFromString(keyValuePairs["i"]);
          if (initial == Initial.Unspecified)
          {
            return null;
          }
          phonologyQuery.Initial = initial;
        }
        // Final
        if (keyValuePairs.ContainsKey("f"))
        {
          var final = PhonologyUtils.GetFinalFromString(keyValuePairs["f"]);
          if (final == Final.Unspecified)
          {
            return null;
          }
          phonologyQuery.Final = final;
        }
        // Tone
        if (keyValuePairs.ContainsKey("t"))
        {
          var tone = PhonologyUtils.GetToneFromString(keyValuePairs["t"]);
          if (tone == Tone.Unspecified)
          {
            return null;
          }
          phonologyQuery.Tone = tone;
        }

        query.PhonologyQuery = phonologyQuery;
        return query;
      }

      if (remainingTokens.Length > 0 && remainingTokens.All(t => rAlphaNumeric.IsMatch(t)))
      {
        query.FuzzyPronQuery = String.Join(" ", remainingTokens);
        return query;
      }

      if (remainingTokens.Length == 1 && !rAlphaNumeric.IsMatch(remainingTokens[0]))
      {
        query.HanziQuery = remainingTokens[0];
        return query;
      }

      return null;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="text"></param>
    /// <returns>(key value pairs, remaining tokens)</returns>
    private static (IDictionary<string, string>, string[]) ParseAsKeyValuePairs(string text)
    {
      var tokens = text.Trim().Split(" ").Where(t => t.Length > 0);
      if (tokens.Count() == 0)
      {
        return (new Dictionary<string, string>(), new string[0]);
      }
      var keyValuePairs = new Dictionary<string, string>();
      var remainingTokens = new List<string>();
      foreach (var token in tokens)
      {
        var columnPos = token.IndexOf(":", StringComparison.Ordinal);
        if (columnPos < 0)
        {
          remainingTokens.Add(token);
          continue;
        }
        var key = token.Substring(0, columnPos);
        var value = token.Substring(columnPos + 1);
        keyValuePairs[key] = value;
      }

      return (keyValuePairs, remainingTokens.ToArray());
    }


    private static Query.Types.SortByMethod? ParseSortByMethod(string text)
    {
      switch (text.Trim().ToLower())
      {
        case "ift":
        case "phonology":
        case "initial_final_tone":
          return Query.Types.SortByMethod.InitialFinalTone;
        default:
          return null;
      }
    }

  }
}
