using System;
using System.IO;
using Google.Protobuf;
using Yngdieng.Indexer.Loading;
using Yngdieng.Indexer.Processing;
using Yngdieng.Protos;

/// <summary>
/// The indexer reads raw data files and dumps document and index files.
/// </summary>
namespace Yngdieng.Indexer
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length < 2)
            {
                PrintHelp();
                return -1;
            }
            var inputFolder = args[0];
            var outputFolder = args[1];
            var versionTag = args.Length > 2 ? args[2] : "notag";
            Console.WriteLine("Using V2 index");
            using (var indexCreator = new IndexV2Creator(inputFolder, outputFolder, versionTag))
            {
                return indexCreator.Run();
            }
        }

        private static void PrintHelp()
        {
            Console.WriteLine("Usage: indexer <data path> <output path>");
        }
    }
}
