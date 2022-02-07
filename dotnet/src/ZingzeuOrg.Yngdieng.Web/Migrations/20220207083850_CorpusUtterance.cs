using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace ZingzeuOrg.Yngdieng.Web.Migrations
{
    public partial class CorpusUtterance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "preferred_corpus_utterance_id",
                table: "words",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "preferred_corpus_utterance_preview_url",
                table: "words",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<Instant>(
                name: "update_time",
                table: "word_lists",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<Instant>(
                name: "creation_time",
                table: "word_lists",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<Instant>(
                name: "creation_time",
                table: "audio_clips",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp without time zone");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "preferred_corpus_utterance_id",
                table: "words");

            migrationBuilder.DropColumn(
                name: "preferred_corpus_utterance_preview_url",
                table: "words");

            migrationBuilder.AlterColumn<Instant>(
                name: "update_time",
                table: "word_lists",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Instant>(
                name: "creation_time",
                table: "word_lists",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Instant>(
                name: "creation_time",
                table: "audio_clips",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp with time zone");
        }
    }
}
