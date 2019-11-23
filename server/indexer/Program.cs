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

            index.Documents.Add(new CreateCikLinDocumentsAction(Path.Combine(inputFolder, "ciklin.csv"), outputFolder).Run());
            index.Documents.Add(new CreateDFDDocumentsAction(Path.Combine(inputFolder, "DFDCharacters.csv"), outputFolder).Run());

            using (var outputFile = File.Create(Path.Combine(outputFolder, "yngdieng_index.bin"))) {
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
