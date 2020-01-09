using System;
using Xunit;
using Yngdieng.Protos;
using Yngdieng.Backend.Services;

namespace Yngdieng.Backend.Tests
{
  public class QueryParserTest
  {
    [Fact]
    public void TestParse_HanziQuery()
    {
      Assert.Equal(new Query
      {
        HanziQuery = "我",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.None
      }, QueryParser.Parse("我"));


      Assert.Equal(new Query
      {
        HanziQuery = "我",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.HanziPhonology
      }, QueryParser.Parse("我 sort:ift group:hanzi_phonology"));
    }

    [Fact]
    public void TestParse_FuzzyPronQuery()
    {
      Assert.Equal(new Query
      {
        FuzzyPronQuery = "sieng noh",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.HanziPhonology
      }, QueryParser.Parse("sieng noh group:hanzi_phonology"));

      Assert.Equal(new Query
      {
        FuzzyPronQuery = "sieng noh",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.HanziPhonology
      }, QueryParser.Parse("group:hanzi_phonology sieng noh"));
    }

    [Fact]
    public void TestParse_PhonologyQueryWithInitialOnly()
    {
      Assert.Equal(new Query
      {
        PhonologyQuery = new Query.Types.PhonologyQuery
        {
          Initial = Initial.L
        },
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.None
      }, QueryParser.Parse("i:柳"));
    }

    [Fact]
    public void TestParse_PhonologyQueryWithFinalOnly()
    {
      Assert.Equal(new Query
      {
        PhonologyQuery = new Query.Types.PhonologyQuery
        {
          Final = Final.A
        },
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.None
      }, QueryParser.Parse("f:嘉"));
    }

    [Fact]
    public void TestParse_PhonologyQueryWithToneOnly()
    {
      Assert.Equal(new Query
      {
        PhonologyQuery = new Query.Types.PhonologyQuery
        {
          Tone = Tone.DownFalling
        },
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.None
      }, QueryParser.Parse("t:下去"));
    }

    [Fact]
    public void TestParse_PhonologyQueryWithInitialFinalTone()
    {
      Assert.Equal(new Query
      {
        PhonologyQuery = new Query.Types.PhonologyQuery
        {
          Initial = Initial.G,
          Final = Final.A,
          Tone = Tone.DownFalling
        },
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
        GroupBy = Query.Types.GroupByMethod.None
      }, QueryParser.Parse("t:下去 f:嘉 i:求"));
    }

    [Fact]
    public void TestParse_InvalidInitial_ReturnsNull()
    {
      Assert.Null(QueryParser.Parse("f:開 i:K"));
    }

    [Fact]
    public void TestParse_InvalidTone_ReturnsNull()
    {
      Assert.Null(QueryParser.Parse("t:下"));
    }

    [Fact]
    public void TestParse_InvalidFinal_ReturnsNull()
    {
      Assert.Null(QueryParser.Parse("t:下去 f:我"));
    }
  }
}
