using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ZingzeuOrg.Yngdieng.Web.Db;

namespace ZingzeuOrg.Yngdieng.Web.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:extension_scope", "contrib,dragon_boat")
                .Annotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .Annotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling");

            migrationBuilder.CreateTable(
                name: "speakers",
                columns: table => new
                {
                    speaker_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    display_name = table.Column<string>(nullable: false),
                    location = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_speakers", x => x.speaker_id);
                });

            migrationBuilder.CreateTable(
                name: "word_lists",
                columns: table => new
                {
                    word_list_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(nullable: false),
                    description = table.Column<string>(nullable: false),
                    update_time = table.Column<Instant>(nullable: false),
                    creation_time = table.Column<Instant>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_word_lists", x => x.word_list_id);
                });

            migrationBuilder.CreateTable(
                name: "words",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    hanzi = table.Column<string>(nullable: false),
                    hanzi_alternatives = table.Column<List<string>>(nullable: false),
                    mandarin_words = table.Column<List<string>>(nullable: false),
                    gloss = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_words", x => x.word_id);
                });

            migrationBuilder.CreateTable(
                name: "audio_clips",
                columns: table => new
                {
                    audio_clip_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    speaker_id = table.Column<int>(nullable: true),
                    pronunciation = table.Column<string>(nullable: false),
                    blob_location = table.Column<string>(nullable: false),
                    mime_type = table.Column<string>(nullable: false),
                    creation_time = table.Column<Instant>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_audio_clips", x => x.audio_clip_id);
                    table.ForeignKey(
                        name: "fk_audio_clips_speakers_speaker_id",
                        column: x => x.speaker_id,
                        principalTable: "speakers",
                        principalColumn: "speaker_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "extensions",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    extension_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    explanation = table.Column<string>(nullable: false),
                    contributors = table.Column<string[]>(nullable: false),
                    source = table.Column<string>(nullable: false),
                    scope = table.Column<ExtensionScope>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_extensions", x => new { x.word_id, x.extension_id });
                    table.ForeignKey(
                        name: "fk_extensions_words_word_id",
                        column: x => x.word_id,
                        principalTable: "words",
                        principalColumn: "word_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "prons",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    pron_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    pronunciation = table.Column<string>(nullable: false),
                    weight = table.Column<long>(nullable: true),
                    variant = table.Column<Variant>(nullable: true),
                    sandhi_category = table.Column<SandhiCategory>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_prons", x => new { x.word_id, x.pron_id });
                    table.ForeignKey(
                        name: "fk_prons_words_word_id",
                        column: x => x.word_id,
                        principalTable: "words",
                        principalColumn: "word_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "word_list_words",
                columns: table => new
                {
                    word_list_id = table.Column<int>(nullable: false),
                    word_id = table.Column<int>(nullable: false),
                    ordering = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_word_list_words", x => new { x.word_list_id, x.word_id });
                    table.ForeignKey(
                        name: "fk_word_list_words_words_word_id",
                        column: x => x.word_id,
                        principalTable: "words",
                        principalColumn: "word_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_word_list_words_word_lists_word_list_id",
                        column: x => x.word_list_id,
                        principalTable: "word_lists",
                        principalColumn: "word_list_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pron_audio_clips",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    pron_id = table.Column<int>(nullable: false),
                    audio_clip_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_pron_audio_clips", x => new { x.word_id, x.pron_id, x.audio_clip_id });
                    table.ForeignKey(
                        name: "fk_pron_audio_clips_prons_word_id_pron_id",
                        columns: x => new { x.word_id, x.audio_clip_id },
                        principalTable: "prons",
                        principalColumns: new[] { "word_id", "pron_id" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_audio_clips_speaker_id",
                table: "audio_clips",
                column: "speaker_id");

            migrationBuilder.CreateIndex(
                name: "ix_pron_audio_clips_word_id_audio_clip_id",
                table: "pron_audio_clips",
                columns: new[] { "word_id", "audio_clip_id" });

            migrationBuilder.CreateIndex(
                name: "ix_word_list_words_word_id",
                table: "word_list_words",
                column: "word_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audio_clips");

            migrationBuilder.DropTable(
                name: "extensions");

            migrationBuilder.DropTable(
                name: "pron_audio_clips");

            migrationBuilder.DropTable(
                name: "word_list_words");

            migrationBuilder.DropTable(
                name: "speakers");

            migrationBuilder.DropTable(
                name: "prons");

            migrationBuilder.DropTable(
                name: "word_lists");

            migrationBuilder.DropTable(
                name: "words");
        }
    }
}
