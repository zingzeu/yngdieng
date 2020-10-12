using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Npgsql;
using Npgsql.NodaTime;
namespace Yngdieng.Backend.Db
{
    public sealed class YngdiengContext : DbContext
    {

        static YngdiengContext()
            => NpgsqlConnection.GlobalTypeMapper
                .MapEnum<ContribScope>()
                .MapEnum<Variant>()
                .MapEnum<SandhiCategory>();

        public DbSet<Word> Words { get; set; }
        public DbSet<Pron> Prons { get; set; }

        public DbSet<PronAudioClip> PronAudioClips { get; set; }

        public DbSet<Contrib> Contribs { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<AudioClip> AudioClips { get; set; }
        public DbSet<WordList> WordLists { get; set; }
        public DbSet<WordListWord> WordListWords { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
           => options.UseNpgsql("Host=localhost;Database=yngdieng;Username=postgres;Password=postgres", o => o.UseNodaTime())
           .UseSnakeCaseNamingConvention()
        ;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder
                .HasPostgresEnum<ContribScope>()
                .HasPostgresEnum<Variant>()
                .HasPostgresEnum<SandhiCategory>();
            builder.Entity<Pron>().HasKey(p => new { p.WordId, p.PronId });
            builder.Entity<Pron>().Property(b => b.PronId).UseIdentityByDefaultColumn();
            builder.Entity<PronAudioClip>().HasKey(p => new { p.WordId, p.PronId, p.AudioClipId });
            builder.Entity<Contrib>().HasKey(p => new { p.WordId, p.ContribId });
            builder.Entity<Contrib>().Property(b => b.ContribId).UseIdentityByDefaultColumn();
            builder.Entity<WordListWord>().HasKey(p => new { p.WordListId, p.WordId });
        }

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
        public string? Gloss { get; set; }


    }

    public sealed class Pron
    {
        public int WordId { get; set; }
        public int PronId { get; set; }

        public string Pronunciation { get; set; }

        // Word frequency for IME
        public long? Weight { get; set; }

        public Variant? Variant { get; set; }

        public SandhiCategory? SandhiCategory { get; set; }
    }

    public enum Variant
    {
        UNSPECIFIED = 0,
        FUZHOU_CITY = 1,
        LIANJIANG = 2,
        CIKLING = 3
    }

    public enum SandhiCategory
    {
        UNSPECIFIED = 0,
        SANDHI = 1,
        BENGZI = 2
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

        public ContribScope Scope { get; set; }

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

        public string? Location { get; set; }
    }

    public sealed class AudioClip
    {
        public int AudioClipId { get; set; }

        public int SpeakerId { get; set; }

        public string Pronunciation { get; set; }

        public string BlobLocation { get; set; }

        public string MimeType { get; set; }

        public Instant CreationTime { get; set; }
    }


    public sealed class WordList
    {
        public int WordListId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public Instant UpdateTime { get; set; }
        public Instant CreationTime { get; set; }
    }

    public sealed class WordListWord
    {
        public int WordListId { get; set; }
        public int WordId { get; set; }
        public int Ordering { get; set; }

        public string Explanation { get; set; }

        public string Description { get; set; }
        public string[] Authors { get; set; }
    }

}
