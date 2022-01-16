using Grpc.Net.Client;
using Grpc.Net.Client.Web;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;
using ZingzeuOrg.Yngdieng.AdminClient;
using Microsoft.AspNetCore.Components;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddMudServices();
builder.Services.AddScoped(services =>
{
    var navigationManager = services.GetService<NavigationManager>();
    var blazorBaseUrl = new Uri(navigationManager.BaseUri);
    var baseUri = $"{blazorBaseUrl.Scheme}://{blazorBaseUrl.Host}:{blazorBaseUrl.Port}";
    Console.WriteLine($"grpc base url = {baseUri}");
    var httpClient = new HttpClient(new GrpcWebHandler(GrpcWebMode.GrpcWeb, new HttpClientHandler()));
    var channel = GrpcChannel.ForAddress(baseUri, new GrpcChannelOptions { HttpClient = httpClient });
    return new Yngdieng.Protos.YngdiengService.YngdiengServiceClient(channel);
});

await builder.Build().RunAsync();
