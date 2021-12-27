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
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseWebAssemblyDebugging();
        }

        // Workaround for serving blazor component files from /admin/_content/
        // FastUI does not follow the base href.
        app.Use(async (context,next) =>
        {
            var path = context.Request.Path.Value;

            if (path.StartsWith("/admin/_content/"))
            {
                context.Request.Path = path.Substring("/admin".Length);
            }
            else if (path=="/admin/_framework/blazor-hotreload") {
                context.Request.Path = "/_framework/blazor-hotreload";
            }

            await next();
        });

        app.UseBlazorFrameworkFiles("/admin");
        app.UseStaticFiles();

        app.UseRouting();
        // Configure the HTTP request pipeline.
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGrpcService<FrontendService>();
            //endpoints.MapFallbackToFile("/admin", "admin/index.html");
            endpoints.MapFallbackToFile("/admin/{*path:nonfile}", "/admin/index.html");
           
        });

    }
}