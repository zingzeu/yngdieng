using System.Diagnostics;
using System.Reflection;
using Aliyun.OSS;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Yngdieng.OpenCC;
using ZingzeuOrg.Yngdieng.Web;
using ZingzeuOrg.Yngdieng.Web.Db;
using ZingzeuOrg.Yngdieng.Web.HealthChecks;
using ZingzeuOrg.Yngdieng.Web.Services;
using ZingzeuOrg.Yngdieng.Web.Services.Admin;
using ZingzeuOrg.Yngdieng.Web.Services.Frontend;
using ZingzeuOrg.Yngdieng.Web.TextToSpeech;

CreateHostBuilder(args).Build().Run();

static IHostBuilder CreateHostBuilder(string[] args) =>
       Host.CreateDefaultBuilder(args)
           .ConfigureWebHostDefaults(webBuilder =>
           {
               webBuilder.UseStartup<Startup>();
           });
class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddGrpc();
        services.AddRouting();
        services.AddSingleton<IndexHealthCheck>();
        services.AddSingleton<TtsHealthCheck>();
        services.AddHealthChecks()
            .AddCheck<IndexHealthCheck>("index_file_loading")
            .AddCheck<TtsHealthCheck>("tts_pronounceable");
        services.AddGrpc();
        services.AddGrpcReflection();
        services.AddSingleton<IIndexHolder, IndexHolder>();
        services.AddSingleton<YngpingAudioSynthesizer>();
        services.AddHostedService<IndexLoaderBackgroundService>();
        services.AddSingleton<ISearchCache, InMemorySearchCache>();
        services.AddSingleton<YngdiengOpenCcClient>();
        services.AddControllers();
        services.AddCors(o => o.AddPolicy("AllowAll", builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().WithExposedHeaders(
                "Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
        }));
        services.AddAuthorization(options =>
        {
            options.AddPolicy("YngdiengAdminAccess", policy =>
                policy.RequireClaim("permissions", "yngdieng:admin"));
        });
        services.AddDbContext<AdminContext>(options =>
            options
                .UseNpgsql(
                    _configuration.GetConnectionString("Postgres"), o => o.UseNodaTime())
                .EnableSensitiveDataLogging()
        );
        services.AddSingleton<OssClient>(service => {
            var ossConfig = _configuration.GetSection("OssConfig");
            // TODO: get access key from HTTP context.
            return new OssClient(
                accessKeyId: ossConfig["AccessKeyId"],
                accessKeySecret: ossConfig["AccessKeySecret"],
                endpoint: ossConfig["Endpoint"]);
        });
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
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path.Value;

            if (path.StartsWith("/admin/_content/"))
            {
                context.Request.Path = path.Substring("/admin".Length);
            }
            else if (path == "/admin/_framework/blazor-hotreload")
            {
                context.Request.Path = "/_framework/blazor-hotreload";
            }

            await next();
        });

        app.UseBlazorFrameworkFiles("/admin");
        app.UseStaticFiles();

        app.UseRouting();
        app.UseCors();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseGrpcWeb(); // Must be between UseRouting and UseEndpoints.

        // Configure the HTTP request pipeline.
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHealthChecks("/healthz");

            endpoints.MapGrpcService<YngdiengService>().EnableGrpcWeb().RequireCors("AllowAll");
            endpoints.MapGrpcService<AdminService>().EnableGrpcWeb().RequireCors("AllowAll");
            endpoints.MapGrpcService<FrontendService>().EnableGrpcWeb().RequireCors("AllowAll");
            if (env.IsDevelopment())
            {
                endpoints.MapGrpcReflectionService();
            }

            endpoints.MapControllers();
            endpoints.MapFallbackToFile("/{*path:nonfile}", "/index.html");
            endpoints.MapFallbackToFile("/admin/{*path:nonfile}", "/admin/index.html");

            endpoints.MapGet("/debugz", async context =>
                {
                    var headers = context.Request.Headers.Select(kvPair => $"{kvPair.Key}: {kvPair.Value}");
                    var headersStr = string.Join("\n", headers);
                    var version = typeof(Startup)
                        .Assembly
                        .GetCustomAttributes<AssemblyInformationalVersionAttribute>()
                        .FirstOrDefault()
                        ?.InformationalVersion;

                    context.Response.ContentType = "text/plain";
                    var chinaTime = Instant.FromDateTimeOffset(System.DateTime.UtcNow).InZone(DateTimeZoneProviders.Tzdb["Asia/Shanghai"]);
                    var uptime = DateTime.Now - Process.GetCurrentProcess().StartTime;
                    await context.Response.WriteAsync(
                        $"Version: {version}\n" +
                        $"UpTime: {uptime.TotalSeconds}s\n" +
                        $"UtcNow: {System.DateTime.UtcNow}\n" +
                        $"ChinaTime: {chinaTime.Date} {chinaTime.Hour}:{chinaTime.Minute}\n" +
                        $"Path: {context.Request.Path}\n" +
                        $"IsHttps: {context.Request.IsHttps}\n" +
                        $"Url: {context.Request.GetDisplayUrl()}\n\n" +
                        $"Headers\n{headersStr}");
                });
        });

    }
}