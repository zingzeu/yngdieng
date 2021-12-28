using Microsoft.AspNetCore.Components;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.AdminClient.Pages
{
    public partial class Index
    {

        [Inject]
        public YngdiengService.YngdiengServiceClient client { get; set; }

        public string IndexVersion { get; set; } = "Loading";

        protected override async Task OnInitializedAsync()
        {
            var debugInfo = await client.GetDebugInfoAsync(new GetDebugInfoRequest());
            Console.WriteLine($"Index version: {debugInfo.IndexVersion}");
            IndexVersion = debugInfo.IndexVersion;
            // StateHasChanged();
        }
    }
}