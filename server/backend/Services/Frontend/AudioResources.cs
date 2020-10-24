using System.Web;
using Yngdieng.Frontend.V3.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class AudioResources
    {
        public static Word.Types.Pronunciation PronunciationWithTts(string displayName, string yngping)
        {
            return new Word.Types.Pronunciation
            {
                DisplayName = "市区单字",
                Pronunciation_ = yngping,
                // TODO: only include TTS audio if pronounceable
                Audio = AudioResourceWithTtsUrls(yngping)
            };
        }

        private static AudioResource AudioResourceWithTtsUrls(string yngping)
        {
            return new AudioResource
            {
                RemoteUrls = new AudioResource.Types.RemoteUrls
                {
                    RemoteUrls_ = {
                        "https://api.ydict.net/tts/"+HttpUtility.UrlEncode(yngping)
                    }
                }
            };
        }
    }
}
