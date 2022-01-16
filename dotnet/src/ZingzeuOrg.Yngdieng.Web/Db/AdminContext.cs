using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Npgsql;
namespace ZingzeuOrg.Yngdieng.Web.Db
{
    public sealed class AdminContext : DbContext
    {

        static AdminContext()
            => NpgsqlConnection.GlobalTypeMapper
                .MapEnum<ExtensionScope>()
                .MapEnum<Variant>()
                .MapEnum<SandhiCategory>()
                .MapEnum<Gender>();

        public DbSet<Word> Words { get; set; }
        public DbSet<FengWord> FengWords { get; set; }
        public DbSet<FengCategory> FengCategories { get; set; }
        public DbSet<WordWithPronIds> WordsWithPronIds { get; set; }
        public DbSet<AudioClipsByWordId> AudioClipsByWordId { get; set; }
        public DbSet<Pron> Prons { get; set; }

        public DbSet<PronAudioClip> PronAudioClips { get; set; }
        public DbSet<WordAudioClip> WordAudioClips { get; set; }

        public DbSet<Extension> Extensions { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<AudioClip> AudioClips { get; set; }
        public DbSet<WordList> WordLists { get; set; }
        public DbSet<WordListWord> WordListWords { get; set; }

        public AdminContext(DbContextOptions<AdminContext> contextOptions) : base(contextOptions)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
           => options.UseSnakeCaseNamingConvention()
        ;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder
                .HasPostgresEnum<ExtensionScope>()
                .HasPostgresEnum<Variant>()
                .HasPostgresEnum<SandhiCategory>()
                .HasPostgresEnum<Gender>();
            builder.Entity<WordWithPronIds>(eb =>
            {
                eb.HasNoKey();
                eb.ToView("SomeView");
            });
            builder.Entity<AudioClipsByWordId>(eb =>
            {
                eb.HasNoKey();
                eb.ToView("SomeView2");
            });
            builder.Entity<Word>().HasOne(w => w.FengCategory).WithMany().HasForeignKey(w => w.FengCategoryId);
            builder.Entity<FengWord>().HasKey(f => new { f.PageNumber, f.LineNumber });
            builder.Entity<FengWord>().HasOne(f => f.LinkedWord).WithMany().HasForeignKey(f => f.WordId);
            builder.Entity<Pron>().HasKey(p => new { p.WordId, p.PronId });
            builder.Entity<Pron>().Property(b => b.PronId).UseIdentityByDefaultColumn();
            builder.Entity<Pron>().HasOne<Word>().WithMany().HasForeignKey(p => p.WordId);
            builder.Entity<PronAudioClip>().HasKey(p => new { p.WordId, p.PronId, p.AudioClipId });
            builder.Entity<PronAudioClip>().HasOne<Pron>().WithMany().HasForeignKey(p => new { p.WordId, p.PronId });
            builder.Entity<PronAudioClip>().HasOne<AudioClip>().WithMany().HasForeignKey(p => p.AudioClipId);
            builder.Entity<WordAudioClip>().HasKey(p => new { p.WordId, p.AudioClipId });
            builder.Entity<WordAudioClip>().HasOne<Word>().WithMany().HasForeignKey(p => p.WordId);
            builder.Entity<WordAudioClip>().HasOne<AudioClip>().WithMany().HasForeignKey(p => p.AudioClipId);
            builder.Entity<Extension>().HasKey(p => new { p.WordId, p.ExtensionId });
            builder.Entity<Extension>().Property(b => b.ExtensionId).UseIdentityByDefaultColumn();
            builder.Entity<Extension>().HasOne<Word>().WithMany().HasForeignKey(e => e.WordId);
            builder.Entity<AudioClip>().HasOne<Speaker>().WithMany().HasForeignKey(a => a.SpeakerId);
            builder.Entity<WordListWord>().HasKey(p => new { p.WordListId, p.WordId });
            builder.Entity<WordListWord>().HasOne<WordList>().WithMany().HasForeignKey(wlw => wlw.WordListId);
            builder.Entity<WordListWord>().HasOne<Word>().WithMany().HasForeignKey(wlw => wlw.WordId);
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

        // TODO: remove this. And migrate to Pron-level PreferredAudioClip.
        // Preferred Sandhi Audio (real-human audio). This is preferred over TTS audio.
        public AudioClip? PreferredSandhiAudio { get; set; }

        public FengCategory? FengCategory { get; set; }

        public string? FengCategoryId { get; set; }

    }

    // Everything is readonly.
    public sealed class FengWord
    {
        public int PageNumber { get; set; }

        public int LineNumber { get; set; }

        public string HanziRaw { get; set; }
        public string HanziOriginal { get; set; }
        public string HanziClean { get; set; }

        public string PronUnderlying { get; set; }

        public string PronSandhi { get; set; }

        public string ExplanationRaw { get; set; }
        public string? ExplanationParsed { get; set; }

        public Word? LinkedWord { get; set; }

        public int? WordId { get; set; }
    }

    // Readonly
    public sealed class FengCategory
    {

        [Key]
        public string Id { get; set; }

        public string LevelOneName { get; set; }

        public string? LevelTwoName { get; set; }
    }

    //[Keyless]
    public sealed class WordWithPronIds
    {

        public int WordId { get; set; }

        // Hanzi. Used for IME and Yngdieng hero.
        public string Hanzi { get; set; }

        // A=
        public List<string> HanziAlternatives { get; set; }

        // M=
        public List<string> MandarinWords { get; set; }

        // G=
        public string? Gloss { get; set; }

        public List<int> PronIds { get; set; }

    }

    //[Keyless]
    public sealed class AudioClipsByWordId
    {

        public int WordId { get; set; }

        public int AudioClipId { get; set; }

        public string Pronunciation { get; set; }

        public string BlobLocation { get; set; }
        public string MimeType { get; set; }
        public string SpeakerDisplayName { get; set; }
        public string? SpeakerLocation { get; set; }
        public int? SpeakerAge { get; set; }
        public Gender SpeakerGender { get; set; }


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

    public sealed class WordAudioClip
    {
        public int WordId { get; set; }
        public int AudioClipId { get; set; }
    }

    public sealed class Extension
    {
        public int WordId { get; set; }
        public int ExtensionId { get; set; }
        public string Explanation { get; set; }
        public string[] Contributors { get; set; }
        public string? Source { get; set; }

        public ExtensionScope Scope { get; set; }

    }

    public enum ExtensionScope
    {
        CONTRIB = 0,
        DRAGON_BOAT = 1
    }

    public sealed class Speaker
    {
        public int SpeakerId { get; set; }

        public string DisplayName { get; set; }

        // 昵称来源 (e.g. QQ, WeChat)
        public string? DisplayNameSource { get; set; }

        // ISO 639-6
        public string? Accent { get; set; }

        // Detailed location
        public string? Location { get; set; }

        public int? YearOfBirth { get; set; }

        public Gender Gender { get; set; }

        // 祖籍地
        public string? AncestralHome { get; set; }

    }

    public enum Gender
    {
        UNSPECIFIED = 0,
        MALE = 1,
        FEMALE = 2
    }

    public sealed class AudioClip
    {
        public int AudioClipId { get; set; }

        public int? SpeakerId { get; set; }

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

    }

}
