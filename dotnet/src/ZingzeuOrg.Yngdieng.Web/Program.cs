using Yngdieng.Admin.V1.Protos;
using Yngdieng.Backend;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.OpenCC;
using ZingzeuOrg.Yngdieng.Web;
using ZingzeuOrg.Yngdieng.Web.Db;
using ZingzeuOrg.Yngdieng.Web.HealthChecks;
using ZingzeuOrg.Yngdieng.Web.Services;
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
                    Configuration.GetConnectionString("Postgres"), o => o.UseNodaTime())
                .EnableSensitiveDataLogging()
        );
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
        });


    }
}