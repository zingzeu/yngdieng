using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Yngdieng.Backend.TextToSpeech;

namespace Yngdieng.Backend.HealthChecks
{

    public sealed class TtsHealthCheck : IHealthCheck
    {

        private readonly YngpingAudioSynthesizer _yngpingAudioSynthesizer;

        public TtsHealthCheck(YngpingAudioSynthesizer yngpingAudioSynthesizer)
        {
            _yngpingAudioSynthesizer = yngpingAudioSynthesizer;
        }

        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            if (_yngpingAudioSynthesizer.YngpingToAudio("a242") == null)
            {
                return Task.FromResult(HealthCheckResult.Unhealthy("Cannot pronounce a242."));
            }
            return Task.FromResult(HealthCheckResult.Healthy("Can pronounce a242."));
        }
    }
}
