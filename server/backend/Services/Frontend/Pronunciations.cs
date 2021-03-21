using Yngdieng.Backend.Db;
using Yngdieng.Backend.TextToSpeech;
using ApiWord = Yngdieng.Frontend.V3.Protos.Word;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Pronunciations
    {

        public static ApiWord.Types.Pronunciation Create(string displayName, string yngping, AudioClip? audioClip = null)
        {
            var word = new ApiWord.Types.Pronunciation
            {
                DisplayName = displayName,
                Pronunciation_ = yngping,
            };
            if (audioClip != null)
            {
                word.Audio = AudioResources.WithAudioClip(audioClip.BlobLocation);
                return word;
            }
            if (YngpingTtsUtil.IsPronounceable(yngping))
            {
                word.Audio = AudioResources.WithTtsUrls(yngping);
            }
            return word;
        }

    }
}
