using Microsoft.AspNetCore.Components;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.AdminClient.Pages
{
    public partial class Index
    {

        [Inject]
        public YngdiengService.YngdiengServiceClient client { get; set; }

        [Inject]
        public ILogger<Index> logger { get; set; }

        public string IndexVersion { get; set; } = "Loading";

        protected override async Task OnInitializedAsync()
        {
            try
            {
                var debugInfo = await client.GetDebugInfoAsync(new GetDebugInfoRequest());
                Console.WriteLine($"Index version: {debugInfo.IndexVersion}");
                IndexVersion = debugInfo.IndexVersion;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error fetching DebugInfo");
                IndexVersion = "Error";
            }
        }
    }
}