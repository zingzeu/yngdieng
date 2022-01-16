using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Aliyun.OSS;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.HealthChecks;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web;

namespace ZingzeuOrg.Yngdieng.Web
{

    public sealed class IndexLoaderBackgroundService : BackgroundService
    {
        private readonly IConfiguration config;
        private readonly ILogger<IndexLoaderBackgroundService> logger;
        private readonly IIndexHolder indexHolder;
        private readonly IndexHealthCheck indexHealthCheck;
        private readonly OssClient ossClient;

        public IndexLoaderBackgroundService(IConfiguration config,
                                            ILogger<IndexLoaderBackgroundService> logger,
                                            IIndexHolder indexHolder,
                                            IndexHealthCheck indexHealthCheck,
                                            OssClient ossClient)
        {
            this.config = config;
            this.logger = logger;
            this.indexHolder = indexHolder;
            this.indexHealthCheck = indexHealthCheck;
            this.ossClient = ossClient;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.WhenAll(LoadYngdiengIndex(), LoadLuceneIndex());
        }

        private async Task LoadYngdiengIndex()
        {
            var indexPath = config["IndexPath"];
            YngdiengIndex index;
            if (config.GetValue<bool>("LoadIndexFromOss"))
            {
                index = await LoadYngdiengIndexFromOss();
            }
            else
            {
                var indexFilePath = Path.GetFullPath(Path.Join(config["IndexPath"], "yngdieng_index.bin"));
                index = await LoadYngdiengIndexFromDisk(indexFilePath);
            }

            indexHolder.StoreIndex(index);
            indexHealthCheck.IndexLoaded = true;
            logger.LogInformation(
                $"{index.HistoricalDocuments.Count} + {index.FengDocuments.Count} documents loaded.");
        }

        private Task<YngdiengIndex> LoadYngdiengIndexFromDisk(string indexFilePath)
        {
            logger.LogInformation($"Loading index from file: {indexFilePath}");
            using (var input = File.OpenRead(indexFilePath))
            {
                var index = YngdiengIndex.Parser.ParseFrom(input);
                return Task.FromResult<YngdiengIndex>(index);
            }
        }

        private Task<YngdiengIndex> LoadYngdiengIndexFromOss()
        {
            var ossConfig = config.GetSection("OssConfig");
            var bucketName = ossConfig.GetValue<string>("BucketName");
            var accessKey = ossConfig.GetValue<string>("AccessKeyId");
            logger.LogInformation($"Loading index from oss bucket: {bucketName}");
            logger.LogInformation($"Accesskey: {accessKey}");
            var metadata = ossClient.GetObjectMetadata(bucketName, "yngdieng_index.bin");
            var etag = metadata.ETag;
            var request = new GeneratePresignedUriRequest(bucketName, "yngdieng_index.bin", SignHttpMethod.Get);
            var downloadUri = ossClient.GeneratePresignedUri(request);
            using (var objectContent = ossClient.GetObject(downloadUri).Content)
            {
                return Task.FromResult<YngdiengIndex>(YngdiengIndex.Parser.ParseFrom(objectContent));

            }
        }

        private Task LoadLuceneIndex()
        {
            // TODO: make it work with OSS.
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
