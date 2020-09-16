using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
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
        [EnableCors("AllowAudioFileGet")]  
        public IActionResult GetAudio(string text)
        {
            var audioBytes = audioSynthesizer.YngpingToAudio(text);
            if (audioBytes == null)
            {
                logger.LogDebug($"Unsupported yngping: {text}");
                return new NotFoundResult();
            }
            return new FileContentResult(audioBytes, "audio/wav");
        }
    }
}
