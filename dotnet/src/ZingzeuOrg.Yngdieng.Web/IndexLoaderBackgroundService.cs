using Aliyun.OSS;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using ZingzeuOrg.Yngdieng.Web.HealthChecks;
using Yngdieng.Protos;
using Directory = System.IO.Directory;

namespace ZingzeuOrg.Yngdieng.Web
{

    public sealed class IndexLoaderBackgroundService : BackgroundService
    {
        private readonly IConfiguration config;
        private readonly ILogger<IndexLoaderBackgroundService> logger;
        private readonly IIndexHolder indexHolder;
        private readonly IndexHealthCheck indexHealthCheck;
        private readonly OssClient ossClient;
        private readonly bool loadIndexFromOss;
        private readonly string ossBucketName;

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
            this.loadIndexFromOss = config.GetValue<bool>("LoadIndexFromOss");
            var ossConfig = config.GetSection("OssConfig");
            this.ossBucketName = ossConfig.GetValue<string>("BucketName");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.WhenAll(LoadYngdiengIndex(), LoadLuceneIndex());
            indexHealthCheck.IndexLoaded = true;
        }

        private async Task LoadYngdiengIndex()
        {
            var indexPath = config["IndexPath"];
            YngdiengIndex index;
            if (loadIndexFromOss)
            {
                index = await LoadYngdiengIndexFromOss();
            }
            else
            {
                var indexFilePath = Path.GetFullPath(Path.Join(config["IndexPath"], "yngdieng_index.bin"));
                index = await LoadYngdiengIndexFromDisk(indexFilePath);
            }
            indexHolder.StoreIndex(index);

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

        private async Task<YngdiengIndex> LoadYngdiengIndexFromOss()
        {
            var metadata = await Task.Run(()=>ossClient.GetObjectMetadata(ossBucketName, "yngdieng_index.bin"));
            logger.LogInformation($"Loading index from oss bucket: {ossBucketName}; ContentLength: {metadata.ContentLength}; ETag: {metadata.ETag}; LastModified: {metadata.LastModified}");
            var etag = metadata.ETag;
            var request = new GeneratePresignedUriRequest(ossBucketName, "yngdieng_index.bin", SignHttpMethod.Get);
            var downloadUri = ossClient.GeneratePresignedUri(request);
            var watch = System.Diagnostics.Stopwatch.StartNew();
            using (var objectContent = ossClient.GetObject(downloadUri).Content)
            using (var stream = new MemoryStream())
            {
                await objectContent.CopyToAsync(stream);
                var index = YngdiengIndex.Parser.ParseFrom(stream);
                watch.Stop();
                logger.LogInformation($"Loading index from oss took {watch.ElapsedMilliseconds}ms");
                return index;
            }
        }

        private async Task LoadLuceneIndex()
        {
            var luceneIndexPath = Path.GetFullPath(Path.Join(config["IndexPath"], "lucene"));
            if (loadIndexFromOss)
            {
                var luceneTmpPath = Path.Join(Path.GetTempPath(), "yngdieng_lucene");
                await DownloadLuceneIndex(luceneTmpPath);
                luceneIndexPath = Path.Join(luceneTmpPath,"lucene");
            }
            await LoadLuceneIndexFromDisk(luceneIndexPath);
        }

        private async Task DownloadLuceneIndex(string destDir)
        {
            var objectListing = ossClient.ListObjects(new ListObjectsRequest(ossBucketName)
            {
                Prefix = "lucene/"
            });
            logger.LogInformation("Found {0} objects in {1}", objectListing.ObjectSummaries.Count(), $"{ossBucketName}/lucene");
            foreach (var objectSummary in objectListing.ObjectSummaries)
            {
                if (objectSummary.Size == 0 && objectSummary.Key.EndsWith("/")) {
                    logger.LogWarning($"Skipping directory object {objectSummary.Key}");
                    continue;
                }
                await CopyObjectToLocal(objectSummary.Key, destDir);
            }
        }

        private async Task CopyObjectToLocal(string objectKey, string destDir)
        {
            logger.LogInformation($"Downloading oss://{ossBucketName}/{objectKey}");
            var request = new GeneratePresignedUriRequest(ossBucketName, objectKey, SignHttpMethod.Get);
            var downloadUri = ossClient.GeneratePresignedUri(request);
            var watch = System.Diagnostics.Stopwatch.StartNew();
            var destFilePath = Path.Join(destDir, objectKey);
            var parentDir = Path.GetDirectoryName(destFilePath);
             if (!Directory.Exists(parentDir))
            {
                logger.LogInformation("Creating dir: {0}", parentDir);
                Directory.CreateDirectory(parentDir);
            }
            Directory.CreateDirectory(parentDir);
            using (var objectContent = ossClient.GetObject(downloadUri).Content)
            using (var fileStream = new FileStream(destFilePath, FileMode.OpenOrCreate))
            {
                await objectContent.CopyToAsync(fileStream);
                watch.Stop();
                logger.LogInformation($"Downloading oss://{ossBucketName}/{objectKey} took {watch.ElapsedMilliseconds}ms");
            }
        }

        private Task LoadLuceneIndexFromDisk(string localLucenePath)
        {
            logger.LogInformation($"Loading Lucene index from {localLucenePath}");

            var reader = DirectoryReader.Open(FSDirectory.Open(new DirectoryInfo(localLucenePath)));
            var searcher = new IndexSearcher(reader);
            logger.LogInformation($"{reader.NumDocs} docs in lucene index");
            indexHolder.LuceneIndexSearcher = searcher;
            return Task.CompletedTask;
        }
    }
}
