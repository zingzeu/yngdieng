using System;

/// <summary>
/// The indexer reads raw data files and dumps document and index files.
/// </summary>
namespace Yngdieng.Indexer
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length != 2) {
                PrintHelp();
                return -1;
            }
            Console.WriteLine("Hello World!");
            return 0;
        }

        private static void PrintHelp() {
            Console.WriteLine("Usage: indexer <data path> <output path>");
        }
    }
}
