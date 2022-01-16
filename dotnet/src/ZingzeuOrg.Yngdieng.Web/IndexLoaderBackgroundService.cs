using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.HealthChecks;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web;

namespace Yngdieng.Backend
{

    public sealed class IndexLoaderBackgroundService : BackgroundService
    {
        private readonly IConfiguration config;
        private readonly ILogger<IndexLoaderBackgroundService> logger;
        private readonly IIndexHolder indexHolder;
        private readonly IndexHealthCheck indexHealthCheck;

        public IndexLoaderBackgroundService(IConfiguration config,
                                            ILogger<IndexLoaderBackgroundService> logger,
                                            IIndexHolder indexHolder,
                                            IndexHealthCheck indexHealthCheck)
        {
            this.config = config;
            this.logger = logger;
            this.indexHolder = indexHolder;
            this.indexHealthCheck = indexHealthCheck;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.WhenAll(LoadYngdiengIndex(), LoadLuceneIndex());
        }

        private Task LoadYngdiengIndex()
        {
            var indexFilePath = Path.GetFullPath(Path.Join(config["IndexPath"], "yngdieng_index.bin"));
            logger.LogInformation($"Loading index from {indexFilePath}");

            using (var input = File.OpenRead(indexFilePath))
            {
                var index = YngdiengIndex.Parser.ParseFrom(input);
                indexHolder.StoreIndex(index);
                indexHealthCheck.IndexLoaded = true;
                logger.LogInformation(
                    $"{index.HistoricalDocuments.Count} + {index.FengDocuments.Count} documents loaded.");
            }
            return Task.CompletedTask;
        }

        private Task LoadLuceneIndex()
        {
            var luceneIndexPath = Path.GetFullPath(Path.Join(config["IndexPath"], "lucene"));
            logger.LogInformation($"Loading Lucene index from {luceneIndexPath}");

            var reader = DirectoryReader.Open(FSDirectory.Open(new DirectoryInfo(luceneIndexPath)));
            var searcher = new IndexSearcher(reader);
            logger.LogInformation($"{reader.NumDocs} docs in lucene index");
            indexHolder.LuceneIndexSearcher = searcher;
            return Task.CompletedTask;
        }
    }
}
