extern alias zingzeudata;
using System;
using System.IO;
using System.Linq;
using Google.Protobuf;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Yngdieng.Common;
using Yngdieng.Indexer.Loading;
using Yngdieng.Indexer.Processing;
using Yngdieng.OpenCC;
using Yngdieng.Protos;
using Yngdieng.Search.Common;

namespace Yngdieng.Indexer
{
    internal sealed class IndexV2Creator : IDisposable
    {

        private readonly string inputFolder;
        private readonly string outputFolder;
        private readonly string versionTag;

        private readonly YngdiengOpenCcClient openCcClient = new YngdiengOpenCcClient();

        public IndexV2Creator(string inputFolder, string outputFolder, string versionTag)
        {
            this.inputFolder = inputFolder;
            this.outputFolder = outputFolder;
            this.versionTag = versionTag;
        }

        public int Run()
        {
            YngpingVariantsUtil.GenerateYngpingVariants("tai33 uang55");
            Console.WriteLine("tai33 uang55".Split(' ').Length);
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
                                      outputFolder,
                                      openCcClient)
                           .Run();
            Console.WriteLine($"Loading Contrib...");
            var contrib = new ContribLoader(Path.Combine(inputFolder, "contrib.tsv")).Run();
            Console.WriteLine($"Loading Redirects...");
            var redirects = new RedirectsLoader(Path.Combine(inputFolder, "redirects.txt")).Run();

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

            index.DocIdRedirections.Add(redirects);

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
            var dirInfo = Path.GetFullPath(Path.Join(outputFolder, "lucene"));
            Console.WriteLine($"Writing to {dirInfo}");
            using (var dir = FSDirectory.Open(new DirectoryInfo(dirInfo)))
            {
                var indexConfig = new IndexWriterConfig(LuceneUtils.AppLuceneVersion,
                  LuceneUtils.GetAnalyzer());
                using (var writer = new IndexWriter(dir, indexConfig))
                {
                    writer.DeleteAll();
                    foreach (var yDoc in index.YngdiengDocuments)
                    {
                        var doc = new Lucene.Net.Documents.Document {
                            new Int32Field(LuceneUtils.Fields.IsSourceless, yDoc.Sources.Count == 0?1:0, Field.Store.YES),
                            new StringField(LuceneUtils.Fields.DocId, yDoc.DocId,Field.Store.YES),
                            new TextField(LuceneUtils.Fields.Yngping, yDoc.YngpingSandhi, Field.Store.NO),
                            new TextField(LuceneUtils.Fields.Hanzi, yDoc.HanziCanonical.Regular, Field.Store.NO),
                            new StringField(LuceneUtils.Fields.YngpingSandhiTonePattern, GetTonePattern(yDoc.YngpingSandhi), Field.Store.NO)
                        };
                        foreach (var m in yDoc.IndexingExtension.MandarinWords)
                        {
                            doc.Add(new TextField(LuceneUtils.Fields.Mandarin, m, Field.Store.NO));
                            doc.Add(new TextField(LuceneUtils.Fields.Mandarin, openCcClient.SimplifyMandarinText(m), Field.Store.NO));
                        }
                        foreach (var a in yDoc.HanziAlternatives)
                        {
                            doc.Add(new TextField(LuceneUtils.Fields.HanziAlternative, a.Regular, Field.Store.NO));
                        }
                        // Simplify Hanzi for search
                        doc.Add(new TextField(LuceneUtils.Fields.Hanzi, openCcClient.SimplifyHukziuText(yDoc.HanziCanonical.Regular), Field.Store.NO));
                        foreach (var e in yDoc.IndexingExtension.ExplanationText)
                        {
                            doc.Add(new TextField(LuceneUtils.Fields.Explanation, e, Field.Store.NO));
                        }
                        // TODO: encapsulate this in a YngpingAnalyzer
                        foreach (var yp in yDoc.IndexingExtension.YngpingPermutations)
                        {
                            doc.Add(new TextField(LuceneUtils.Fields.Yngping, yp, Field.Store.NO));
                        }
                        writer.AddDocument(doc);
                    }
                    writer.Flush(triggerMerge: false, applyAllDeletes: false);
                }
            }
        }

        private static string GetTonePattern(string yngping)
        {
            return string.Join("-",
              yngping.Split(" ").Select(s => zingzeudata.ZingzeuData.Yngping.Yngping0_4_0Validator.ParseHukziuSyllable(s)?.Item3)
              .Where(x => !string.IsNullOrEmpty(x))
            );
        }

        public void Dispose()
        {
            openCcClient.Dispose();
        }
    }
}
