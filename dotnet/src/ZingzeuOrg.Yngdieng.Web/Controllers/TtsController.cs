using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.TextToSpeech;

namespace ZingzeuOrg.Yngdieng.Web.Controllers
{

    public sealed class TtsController : Controller
    {

        private static readonly ISet<string> SupportedFormats = new HashSet<string>() { "wav", "mp3" };
        private readonly ILogger<TtsController> logger;
        private readonly YngpingAudioSynthesizer audioSynthesizer;

        public TtsController(ILogger<TtsController> logger,
                             YngpingAudioSynthesizer audioSynthesizer)
        {
            this.logger = logger;
            this.audioSynthesizer = audioSynthesizer;
        }

        [Route("tts/{text}")]
        [EnableCors("AllowAll")]
        public async Task<IActionResult> GetAudio(string text)
        {
            var dotPosition = text.LastIndexOf(".");
            string yngping;
            string ext;
            if (dotPosition != -1)
            {
                yngping = text.Substring(0, dotPosition);
                ext = text.Substring(dotPosition + 1).ToLowerInvariant().Trim();
            }
            else
            {
                yngping = text;
                ext = "wav";
            }
            if (!SupportedFormats.Contains(ext))
            {
                return new UnsupportedMediaTypeResult();
            }
            var audioBytes = audioSynthesizer.YngpingToAudio(yngping);
            if (audioBytes == null)
            {
                logger.LogDebug($"Unsupported yngping: {yngping}");
                return new NotFoundResult();
            }
            switch (ext)
            {
                case "wav":
                    return new FileContentResult(audioBytes, "audio/wav");
                case "mp3":
                    return new FileContentResult(await AudioConversion.WavToMp3(audioBytes), "audio/mp3");
                default:
                    throw new Exception("Should not have reached here.");
            }

        }
    }
}
