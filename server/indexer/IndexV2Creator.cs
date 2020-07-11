using System;
using System.IO;
using Google.Protobuf;
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
                new ZingzeuWordsLoader(Path.Combine(inputFolder, "zingzeu_words.txt"));

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
            var feng = new FengLoader(Path.Combine(inputFolder, "feng.txt"), outputFolder).Run();

            index.Version = versionTag;
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
    }
}