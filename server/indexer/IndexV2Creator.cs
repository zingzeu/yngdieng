using System;
using System.IO;
using Google.Protobuf;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Lucene.Net.Analysis.Standard;
using Yngdieng.Indexer.Loading;
using Yngdieng.Indexer.Processing;
using Yngdieng.Protos;

namespace Yngdieng.Indexer
{
  internal sealed class IndexV2Creator
  {

    private readonly string inputFolder;
    private readonly string outputFolder;
    private readonly string versionTag;

    public IndexV2Creator(string inputFolder, string outputFolder, string versionTag)
    {
      this.inputFolder = inputFolder;
      this.outputFolder = outputFolder;
      this.versionTag = versionTag;
    }

    public int Run()
    {
      Console.WriteLine($"Input: {Path.GetFullPath(inputFolder)}");
      Console.WriteLine($"Output: {Path.GetFullPath(outputFolder)}");
      var index = new YngdiengIndex();
      var hanziVariantsUtil = new HanziVariantsUtil(inputFolder);
      var aggregator = new HistoricalDocAggregator();

      Console.WriteLine($"Loading zingzeu_words...");
      var zingzeuWords =
          new ZingzeuWordsLoader(Path.Combine(inputFolder, "zingzeu_words.txt")).Run();

      Console.WriteLine($"Loading CikLinBekIn...");
      var ciklin = new CikLingLoader(Path.Combine(inputFolder, "CikLinBekIn.csv"),
                                     outputFolder,
                                     hanziVariantsUtil)
                       .Run();
      Console.WriteLine($"Loading DFD...");
      var dfd = new DFDLoader(Path.Combine(inputFolder, "DFDCharacters.csv"),
                              outputFolder,
                              hanziVariantsUtil)
                    .Run();
      Console.WriteLine($"Loading Feng...");
      var feng = new FengLoader(Path.Combine(inputFolder, "feng.txt"),
                                Path.Combine(inputFolder, "feng_zeu_mapping.txt"),
                                outputFolder)
                     .Run();
      Console.WriteLine($"Loading Contrib...");
      var contrib = new ContribLoader(Path.Combine(inputFolder, "contrib.tsv")).Run();

      index.Version = versionTag;
      index.FengDocuments.Add(feng);
      foreach (var d in ciklin)
      {
        aggregator.Add(d);
      }
      foreach (var d in dfd)
      {
        aggregator.Add(d);
      }
      index.HistoricalDocuments.AddRange(aggregator.GetHistoricalDocuments());

      index.YngdiengDocuments.AddRange(YngdiengDocumentUtil.Combine(
          zingzeuWords, index.HistoricalDocuments, feng, contrib));

      var debugJsonOutput = index.ToString();
      File.WriteAllText(Path.Combine(outputFolder, "index_debug.json"), debugJsonOutput);

      using (var outputFile = File.Create(Path.Combine(outputFolder, "yngdieng_index.bin")))
      {
        index.WriteTo(outputFile);
      }

      CreateLuceneIndex(index);
      return 0;
    }

    private void CreateLuceneIndex(YngdiengIndex index)
    {
      // Ensures index backwards compatibility
      var AppLuceneVersion = LuceneVersion.LUCENE_48;

      var dirInfo = Path.GetFullPath(Path.Join(outputFolder, "lucene"));
      Console.WriteLine($"Writing to {dirInfo}");
      using (var dir = FSDirectory.Open(new DirectoryInfo(dirInfo)))
      {

        //create an analyzer to process the text
        var analyzer = new StandardAnalyzer(AppLuceneVersion);

        //create an index writer
        var indexConfig = new IndexWriterConfig(AppLuceneVersion, analyzer);
        using (var writer = new IndexWriter(dir, indexConfig))
        {

          foreach (var yDoc in index.YngdiengDocuments)
          {
            var doc = new Lucene.Net.Documents.Document{
                    new StringField("yngping", yDoc.YngpingSandhi, Field.Store. NO),
                    new StringField("doc_id", yDoc.DocId,Field.Store.YES),
                    new StringField("hanzi", yDoc.HanziCanonical.Regular, Field.Store.NO),
                };
            writer.AddDocument(doc);

          }
          writer.Flush(triggerMerge: false, applyAllDeletes: false);
        }
      }
    }
  }
}
