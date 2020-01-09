using System;
using System.Collections.Generic;
using Yngdieng.Protos;
using Google.Protobuf;
using System.Linq;

namespace Yngdieng.Indexer
{
  public class DocumentAggregator
  {
    public DocumentAggregator()
    {
    }

    private readonly IDictionary<string, AggregatedDocument> documents = new Dictionary<string, AggregatedDocument>();

    public void Add(Document d)
    {
      var key = new DocumentAggregateKey
      {
        HanziCanonical = d.HanziCanonical,
        Initial = d.Initial,
        Final = d.Final,
        Tone = d.Tone
      }.ToByteString().ToBase64();

      if (!documents.ContainsKey(key))
      {
        documents[key] = new AggregatedDocument();
      }
      documents[key].Initial = d.Initial;
      documents[key].Final = d.Final;
      documents[key].Tone = d.Tone;
      documents[key].HanziCanonical = d.HanziCanonical;
      documents[key].Buc = d.Buc;

      var altA = documents[key].HanziAlternatives;
      var altB = d.HanziAlternatives;
      var altMerged = altA.Union(altB).Distinct().ToList();
      documents[key].HanziAlternatives.Clear();
      documents[key].HanziAlternatives.AddRange(altMerged);

      var mA = documents[key].HanziMatchable;
      var mB = d.HanziMatchable;
      var mMerged = mA.Union(mB).Distinct().ToList();
      documents[key].HanziMatchable.Clear();
      documents[key].HanziMatchable.AddRange(mMerged);

      if (d.SourceInfoCase == Document.SourceInfoOneofCase.Ciklin)
      {
        documents[key].CiklinSource = d.Ciklin;
      }

      if (d.SourceInfoCase == Document.SourceInfoOneofCase.Dfd)
      {
        documents[key].DfdSource = d.Dfd;
      }
    }

    public IEnumerable<AggregatedDocument> GetAggregatedDocuments()
    {
      return documents.Values;
    }

  }
}
