using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.TextToSpeech;

namespace Yngdieng.Backend.Controllers
{

    public sealed class TtsController : Controller
    {
        private readonly ILogger<TtsController> logger;
        private readonly YngpingAudioSynthesizer audioSynthesizer;

        public TtsController(ILogger<TtsController> logger,
                             YngpingAudioSynthesizer audioSynthesizer)
        {
            this.logger = logger;
            this.audioSynthesizer = audioSynthesizer;
        }

        [Route("tts/{text}")]
        public IActionResult GetAudio(string text)
        {
            logger.LogDebug($"Speak {text}");
            return new RedirectResult("https://bing.com");
        }
    }
}