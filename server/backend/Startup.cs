using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Yngdieng.Backend.Services;
using Yngdieng.Backend.HealthChecks;
using Yngdieng.Backend.TextToSpeech;

namespace Yngdieng.Backend
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IndexHealthCheck>();
            services.AddHealthChecks().AddCheck<IndexHealthCheck>("index_file_loading");
            services.AddGrpc();
            services.AddSingleton<IIndexHolder, IndexHolder>();
            services.AddSingleton<YngpingAudioSynthesizer>();
            services.AddHostedService<IndexLoaderBackgroundService>();
            services.AddSingleton<ISearchCache, InMemorySearchCache>();
            services.AddControllers();
            services.AddCors(o => o.AddPolicy("AllowAll", builder => {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().WithExposedHeaders(
                    "Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
            }));
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

            app.UseGrpcWeb(); // Must be between UseRouting and UseEndpoints.
            app.UseCors();

            app.UseEndpoints(endpoints => {
                endpoints.MapHealthChecks("/health");

                endpoints.MapGrpcService<YngdiengService>().EnableGrpcWeb().RequireCors("AllowAll");

                endpoints.MapControllers();

                endpoints.MapGet("/", async context => {
                    await context.Response.WriteAsync(
                        "Communication with gRPC endpoints must be made through a gRPC client. ");
                });
            });
        }
    }

}
