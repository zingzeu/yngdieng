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
            var url = context.Request.Path.Value;

            if (url.StartsWith("/admin/_content/"))
            {
                context.Request.Path = url.Substring("/admin".Length);
                Console.WriteLine($"new path: {context.Request.Path}");
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