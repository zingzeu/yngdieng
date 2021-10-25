using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Yngdieng.Backend.Db;
using Yngdieng.Backend.HealthChecks;
using Yngdieng.Backend.Services;
using Yngdieng.Backend.Services.Admin;
using Yngdieng.Backend.Services.Frontend;
using Yngdieng.Backend.TextToSpeech;
using Yngdieng.OpenCC;

namespace Yngdieng.Backend
{
    public class Startup
    {

        private readonly IConfiguration Configuration;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
        {
            options.Authority = "https://ydict-admin.us.auth0.com/";
            options.Audience = "https://api.ydict.net";
        });
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

        // This method gets called by the runtime. Use this method to configure the HTTP request
        // pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseGrpcWeb(); // Must be between UseRouting and UseEndpoints.

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

                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync(
                        "Communication with gRPC endpoints must be made through a gRPC client. ");
                });
            });
        }
    }

}
