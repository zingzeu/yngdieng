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
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit
        // https://go.microsoft.com/fwlink/?LinkID=398940
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

            app.UseEndpoints(endpoints => {
                endpoints.MapHealthChecks("/health");

                endpoints.MapGrpcService<YngdiengService>();

                endpoints.MapControllers();

                endpoints.MapGet("/", async context => {
                    await context.Response.WriteAsync(
                        "Communication with gRPC endpoints must be made through a gRPC client. ");
                });
            });
        }
    }

}
