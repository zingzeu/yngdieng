using ZingzeuOrg.Yngdieng.Web.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using FrontendProtos = Yngdieng.Frontend.V3.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Frontend
{
    public static class Renderers
    {

        public static FrontendProtos.Word.Types.AudioCard ToAudioCard(Db.AudioClipsByWordId a)
        {
            var gender = a.SpeakerGender == Gender.MALE ? "男" : "女";
            var hintPrimary = a.SpeakerAge.HasValue ? $"{a.SpeakerDisplayName} | {a.SpeakerAge} | {gender}"
                : $"{a.SpeakerDisplayName} | {gender}";
            return new FrontendProtos.Word.Types.AudioCard()
            {
                Pronunciation = a.Pronunciation,
                HintPrimary = hintPrimary,
                HintSecondary = a.SpeakerLocation ?? string.Empty,
                Audio = AudioResources.WithAudioClip(a.BlobLocation)
            };
        }

        public static FrontendProtos.WordList ToWordList(Db.WordList wordList)
        {
            return new FrontendProtos.WordList()
            {
                Name = ResourceNames.ToWordListName(wordList.WordListId),
                Title = wordList.Title,
                Description = wordList.Description,
                Upvotes = 123,
            };
        }

    }
}
