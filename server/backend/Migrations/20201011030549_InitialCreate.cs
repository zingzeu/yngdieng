using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Yngdieng.Backend.Db;

namespace Yngdieng.Backend.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:contrib_scope", "default,dragon_boat")
                .Annotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .Annotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling");

            migrationBuilder.CreateTable(
                name: "audio_clips",
                columns: table => new
                {
                    audio_clip_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    speaker_id = table.Column<int>(nullable: false),
                    pronunciation = table.Column<string>(nullable: false),
                    blob_location = table.Column<string>(nullable: false),
                    mime_type = table.Column<string>(nullable: false),
                    creation_time = table.Column<Instant>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_audio_clips", x => x.audio_clip_id);
                });

            migrationBuilder.CreateTable(
                name: "contribs",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    contrib_id = table.Column<int>(nullable: false),
                    source = table.Column<ContribScope>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_contribs", x => new { x.word_id, x.contrib_id });
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
                });

            migrationBuilder.CreateTable(
                name: "prons",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    pron_id = table.Column<int>(nullable: false),
                    pronunciation = table.Column<string>(nullable: false),
                    weight = table.Column<long>(nullable: false),
                    variant = table.Column<Variant>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_prons", x => new { x.word_id, x.pron_id });
                });

            migrationBuilder.CreateTable(
                name: "speakers",
                columns: table => new
                {
                    speaker_id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    display_name = table.Column<string>(nullable: false),
                    location = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_speakers", x => x.speaker_id);
                });

            migrationBuilder.CreateTable(
                name: "word_list_words",
                columns: table => new
                {
                    word_list_id = table.Column<int>(nullable: false),
                    word_id = table.Column<int>(nullable: false),
                    rank = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_word_list_words", x => new { x.word_list_id, x.word_id });
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
                    gloss = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_words", x => x.word_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audio_clips");

            migrationBuilder.DropTable(
                name: "contribs");

            migrationBuilder.DropTable(
                name: "pron_audio_clips");

            migrationBuilder.DropTable(
                name: "prons");

            migrationBuilder.DropTable(
                name: "speakers");

            migrationBuilder.DropTable(
                name: "word_list_words");

            migrationBuilder.DropTable(
                name: "word_lists");

            migrationBuilder.DropTable(
                name: "words");
        }
    }
}
