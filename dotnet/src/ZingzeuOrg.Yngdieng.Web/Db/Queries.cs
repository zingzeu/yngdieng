using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ZingzeuOrg.Yngdieng.Web.Db
{
    public static class Queries
    {
        public static IQueryable<AudioClipsByWordId> QueryAudioClipsByWordId(AdminContext dbContext, int wordId)
        {
            return dbContext.AudioClipsByWordId
                        .FromSqlRaw(@"
                                        select
                                        word_audio_clips.word_id,
                                        word_audio_clips.audio_clip_id,
                                        audio_clips.pronunciation,
                                        audio_clips.blob_location,
                                        audio_clips.mime_type,
                                        speakers.display_name as speaker_display_name,
                                        speakers.location as speaker_location,
                                        CAST(date_part('year', CURRENT_DATE) - speakers.year_of_birth as integer) as speaker_age,
                                        speakers.gender as speaker_gender
                        from word_audio_clips
                        join audio_clips on audio_clips.audio_clip_id = word_audio_clips.audio_clip_id
                        join speakers on speakers.speaker_id = audio_clips.speaker_id
                        where word_id ={0}
                        ", wordId);
        }

        public static IQueryable<WordList> QueryWordListsByWordId(AdminContext dbContext, int wordId)
        {
            return dbContext.WordLists
                .FromSqlRaw(@"
                        select word_lists.*
                        from word_lists
                        join word_list_words on word_list_words.word_list_id = word_lists.word_list_id
                        where word_list_words.word_id ={0}
                        order by word_lists.word_list_id
                        ", wordId);
        }
    }
}
