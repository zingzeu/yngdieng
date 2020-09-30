using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using NAudio.MediaFoundation;

namespace Yngdieng.Backend
{
    class Program
    {
        static int Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            return 0;
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}
