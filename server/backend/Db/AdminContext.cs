﻿using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Npgsql;
namespace Yngdieng.Backend.Db
{
    public sealed class AdminContext : DbContext
    {

        static AdminContext()
            => NpgsqlConnection.GlobalTypeMapper
                .MapEnum<ExtensionScope>()
                .MapEnum<Variant>()
                .MapEnum<SandhiCategory>();

        public DbSet<Word> Words { get; set; }
        public DbSet<WordWithPronIds> WordsWithPronIds { get; set; }
        public DbSet<Pron> Prons { get; set; }

        public DbSet<PronAudioClip> PronAudioClips { get; set; }

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
                .HasPostgresEnum<SandhiCategory>();
            builder.Entity<WordWithPronIds>(eb =>
            {
                eb.HasNoKey();
                eb.ToView("SomeView");
            });
            builder.Entity<Pron>().HasKey(p => new { p.WordId, p.PronId });
            builder.Entity<Pron>().Property(b => b.PronId).UseIdentityByDefaultColumn();
            builder.Entity<Pron>().HasOne<Word>().WithMany().HasForeignKey(p => p.WordId);
            builder.Entity<PronAudioClip>().HasKey(p => new { p.WordId, p.PronId, p.AudioClipId });
            builder.Entity<PronAudioClip>().HasOne<Pron>().WithMany().HasForeignKey(p => new { p.WordId, p.AudioClipId });
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

    public sealed class Extension
    {
        public int WordId { get; set; }
        public int ExtensionId { get; set; }
        public string Explanation { get; set; }
        public string[] Contributors { get; set; }
        public string Source { get; set; }

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

        public string? Location { get; set; }
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
