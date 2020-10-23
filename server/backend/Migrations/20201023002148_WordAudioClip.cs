using Microsoft.EntityFrameworkCore.Migrations;

namespace Yngdieng.Backend.Migrations
{
    public partial class WordAudioClip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "word_audio_clips",
                columns: table => new
                {
                    word_id = table.Column<int>(nullable: false),
                    audio_clip_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_word_audio_clips", x => new { x.word_id, x.audio_clip_id });
                    table.ForeignKey(
                        name: "fk_word_audio_clips_prons_pron_word_id_pron_id",
                        columns: x => new { x.word_id, x.audio_clip_id },
                        principalTable: "prons",
                        principalColumns: new[] { "word_id", "pron_id" },
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "word_audio_clips");
        }
    }
}
