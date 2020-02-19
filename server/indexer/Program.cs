using System;
using System.IO;
using Yngdieng.Protos;
using Google.Protobuf;

/// <summary>
/// The indexer reads raw data files and dumps document and index files.
/// </summary>
namespace Yngdieng.Indexer
{
  class Program
  {
    static int Main(string[] args)
    {
      if (args.Length != 2)
      {
        PrintHelp();
        return -1;
      }
      var inputFolder = args[0];
      var outputFolder = args[1];
      Console.WriteLine($"Input: {Path.GetFullPath(inputFolder)}");
      Console.WriteLine($"Output: {Path.GetFullPath(outputFolder)}");
      var index = new YngdiengIndex();
      var hanziVariantsUtil = new HanziVariantsUtil(inputFolder);
      var aggregator = new DocumentAggregator();

      var ciklin = new CreateCikLinDocumentsAction(Path.Combine(inputFolder, "ciklin.csv"), outputFolder, hanziVariantsUtil).Run();
      var dfd = new CreateDFDDocumentsAction(Path.Combine(inputFolder, "DFDCharacters.csv"), outputFolder, hanziVariantsUtil).Run();
      var feng = new CreateFengDocumentsAction(Path.Combine(inputFolder, "feng.txt"), outputFolder).Run();

      index.Documents.Add(ciklin);
      index.Documents.Add(dfd);
      index.FengDocuments.Add(feng);
      foreach (var d in ciklin)
      {
        aggregator.Add(d);
      }
      foreach (var d in dfd)
      {
        aggregator.Add(d);
      }
      index.AggregatedDocument.AddRange(aggregator.GetAggregatedDocuments());

      using (var outputFile = File.Create(Path.Combine(outputFolder, "yngdieng_index.bin")))
      {
        index.WriteTo(outputFile);
      }
      return 0;
    }

    private static void PrintHelp()
    {
      Console.WriteLine("Usage: indexer <data path> <output path>");
    }
  }
}
