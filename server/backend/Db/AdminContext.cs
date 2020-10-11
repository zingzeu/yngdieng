using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
namespace Yngdieng.Backend.Db
{
    public sealed class YngdiengContext : DbContext
    {
        public DbSet<Word> Words { get; set; }
        public DbSet<Pron> Prons { get; set; }

        public DbSet<PronAudioClip> PronAudioClips { get; set; }

        public DbSet<Contrib> Contribs { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<AudioClip> AudioClips { get; set; }
        public DbSet<WordList> WordLists { get; set; }
        public DbSet<WordListWord> WordListWords { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
           => options.UseNpgsql("Host=localhost;Database=yngdieng;Username=postgres;Password=postgres")
           .UseSnakeCaseNamingConvention()
           .UseNodaTime();

    }

    public sealed class Word
    {
        // TODO: revisions

        public int WordId { get; set; }

        // Hanzi. Used for IME and Yngdieng hero.
        public string Hanzi { get; set; }

        // A=
        public List<string> HanziAlternatives { get; set; }

        // M=
        public List<string> MandarinWords { get; set; }

        // G=
        public string Gloss { get; set; }


    }

    public sealed class Pron
    {
        public int WordId { get; set; }
        public int PronId { get; set; }

        public string Pronunciation { get; set; }

        // Word frequency for IME
        public long Weight { get; set; }
    }

    public sealed class PronAudioClip
    {

        public int WordId { get; set; }
        public int PronId { get; set; }
        public int AudioClipId { get; set; }
    }

    public sealed class Contrib
    {
        public int WordId { get; set; }
        public int ContribId { get; set; }

        public ContribScope Source { get; set; }

    }

    public enum ContribScope
    {
        DEFAULT = 0,
        DRAGON_BOAT = 1
    }

    public sealed class Speaker
    {
        public int SpeakerId { get; set; }

        public string DisplayName { get; set; }

        public string Location { get; set; }
    }

    public sealed class AudioClip
    {
        public int AudioClipId { get; set; }

        public int SpeakerId { get; set; }

        public string Pronunciation { get; set; }

        public string BlobLocation { get; set; }

        public string MimeType { get; set; }


    }

    public sealed class WordAudioClip
    {

    }

    public sealed class WordList
    {

    }

    public sealed class WordListWord
    {

    }

}
