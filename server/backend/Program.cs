using System;
using System.IO;
using Yngdieng.Protos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using System.Net;

namespace Yngdieng.Backend
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("Usage: backend <index file>");
                return -1;
            }
            var indexFilePath = args[0];
            Console.WriteLine($"Loading index from {Path.GetFullPath(indexFilePath)}");

            YngdiengIndex index;
            using (var input = File.OpenRead(indexFilePath))
            {
                index = YngdiengIndex.Parser.ParseFrom(input);
            }

            Console.WriteLine($"{index.Documents.Count} documents loaded.");



            CreateHostBuilder(args).Build().Run();
            return 0;
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                    .UseStartup<Startup>()
                    .ConfigureKestrel(options =>
                    {
                        options.Listen(IPAddress.Any, 5001, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http2;
                        });
                    });
                });
    }
}
