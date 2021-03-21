using Microsoft.EntityFrameworkCore.Migrations;

namespace Yngdieng.Backend.Migrations
{
    public partial class PreferredAudioClip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "preferred_sandhi_audio_audio_clip_id",
                table: "words",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_words_preferred_sandhi_audio_audio_clip_id",
                table: "words",
                column: "preferred_sandhi_audio_audio_clip_id");

            migrationBuilder.AddForeignKey(
                name: "fk_words_audio_clips_preferred_sandhi_audio_audio_clip_id",
                table: "words",
                column: "preferred_sandhi_audio_audio_clip_id",
                principalTable: "audio_clips",
                principalColumn: "audio_clip_id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_words_audio_clips_preferred_sandhi_audio_audio_clip_id",
                table: "words");

            migrationBuilder.DropIndex(
                name: "ix_words_preferred_sandhi_audio_audio_clip_id",
                table: "words");

            migrationBuilder.DropColumn(
                name: "preferred_sandhi_audio_audio_clip_id",
                table: "words");
        }
    }
}
