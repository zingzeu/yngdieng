using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using Word = Yngdieng.Frontend.V3.Protos.Word;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class Renderers
    {

        public static Word.Types.AudioCard ToAudioCard(Db.AudioClipsByWordId a)
        {
            var gender = a.SpeakerGender == Gender.MALE ? "男" : "女";
            var hintPrimary = a.SpeakerAge.HasValue ? $"{a.SpeakerDisplayName} | {a.SpeakerAge} | {gender}"
                : $"{a.SpeakerDisplayName} | {gender}";
            return new Word.Types.AudioCard()
            {
                Pronunciation = a.Pronunciation,
                HintPrimary = hintPrimary,
                HintSecondary = a.SpeakerLocation ?? string.Empty,
                Audio = new AudioResource()
                {
                    RemoteUrls = new AudioResource.Types.RemoteUrls()
                    {
                        RemoteUrls_ = { "https://yngdieng-media.oss-cn-hangzhou.aliyuncs.com/" + a.BlobLocation }
                    }
                }
            };
        }

        public static Yngdieng.Frontend.V3.Protos.WordList ToWordList(Db.WordList wordList)
        {
            return new Yngdieng.Frontend.V3.Protos.WordList()
            {
                Name = ResourceNames.ToWordListName(wordList.WordListId),
                Title = wordList.Title,
                Description = wordList.Description,
                Upvotes = 123,
            };
        }

    }
}
