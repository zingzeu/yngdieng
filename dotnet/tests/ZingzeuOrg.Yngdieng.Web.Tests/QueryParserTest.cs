using System;
using Xunit;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web.Services;

namespace ZingzeuOrg.Yngdieng.Web.Tests
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
      }, QueryParser.Parse("我"));

      Assert.Equal(new Query
      {
        HanziQuery = "食飯",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
      }, QueryParser.Parse("食飯"));

      Assert.Equal(new Query
      {
        HanziQuery = "我",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
      }, QueryParser.Parse("我 sort:ift"));
    }

    [Fact]
    public void TestParse_HanziQuery_RespectsAlwaysIncludeHistoricalOption()
    {
        Assert.Equal(new Query{HanziQuery = "我",
                               SortBy = Query.Types.SortByMethod.InitialFinalTone,
                               AlwaysIncludeHistorical = false},
                     QueryParser.Parse("我"));
        Assert.Equal(new Query{HanziQuery = "我",
                               SortBy = Query.Types.SortByMethod.InitialFinalTone,
                               AlwaysIncludeHistorical = true},
                     QueryParser.Parse("我 historical:yes"));
        Assert.Equal(new Query{HanziQuery = "我",
                               SortBy = Query.Types.SortByMethod.InitialFinalTone,
                               AlwaysIncludeHistorical = true},
                     QueryParser.Parse("我 historical:true"));
        Assert.Equal(new Query{HanziQuery = "我",
                               SortBy = Query.Types.SortByMethod.InitialFinalTone,
                               AlwaysIncludeHistorical = true,
                               OnlyHistorical = true},
                     QueryParser.Parse("我 historical:only"));
    }

    [Fact]
    public void TestParse_FuzzyPronQuery()
    {
      Assert.Equal(new Query
      {
        FuzzyPronQuery = "sieng noh",
        SortBy = Query.Types.SortByMethod.InitialFinalTone,
      }, QueryParser.Parse("sieng noh"));
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
