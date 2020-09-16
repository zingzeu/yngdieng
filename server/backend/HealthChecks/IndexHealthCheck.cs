using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Yngdieng.Backend.HealthChecks
{

    public sealed class IndexHealthCheck : IHealthCheck
    {
        private volatile bool _indexLoaded = false;

        public bool IndexLoaded
        {
            set
            {
                _indexLoaded = value;
            }
        }

        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            if (_indexLoaded)
            {
                return Task.FromResult(HealthCheckResult.Healthy("Index is loaded."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("Index not yet loaded."));
        }
    }
}
