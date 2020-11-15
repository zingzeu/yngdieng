using System;
using System.Web;
using Yngdieng.Backend.TextToSpeech;
using Yngdieng.Frontend.V3.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class AudioResources
    {
        public static Word.Types.Pronunciation PronunciationWithTts(string displayName, string yngping)
        {
            var word = new Word.Types.Pronunciation
            {
                DisplayName = displayName,
                Pronunciation_ = yngping,
            };
            if (YngpingTtsUtil.IsPronounceable(yngping))
            {
                word.Audio = AudioResourceWithTtsUrls(yngping);
            }
            return word;
        }

        private static AudioResource AudioResourceWithTtsUrls(string yngping)
        {
            return new AudioResource
            {
                RemoteUrls = new AudioResource.Types.RemoteUrls
                {
                    RemoteUrls_ = {
                        "https://api.ydict.net/tts/"+Uri.EscapeDataString(yngping)+".mp3"
                    }
                }
            };
        }
    }
}
