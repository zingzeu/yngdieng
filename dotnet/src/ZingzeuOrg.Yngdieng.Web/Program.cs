using ZingzeuOrg.Yngdieng.Web.Areas.Frontend;

CreateHostBuilder(args).Build().Run();

static IHostBuilder CreateHostBuilder(string[] args) =>
       Host.CreateDefaultBuilder(args)
           .ConfigureWebHostDefaults(webBuilder =>
           {
               webBuilder.UseStartup<Startup>();
           });
class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddGrpc();
        services.AddRouting();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseBlazorFrameworkFiles();
        app.UseBlazorFrameworkFiles("/admin/");
        app.UseStaticFiles();

        app.UseRouting();
        // Configure the HTTP request pipeline.
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGrpcService<FrontendService>();
            //endpoints.MapFallbackToFile("/admin/{*path:nonfile}", "admin/index.html");
        });

    }
}