using Microsoft.EntityFrameworkCore.Migrations;

namespace Yngdieng.Backend.Migrations
{
    public partial class FixForeignKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pron_audio_clips_prons_word_id_pron_id",
                table: "pron_audio_clips");

            migrationBuilder.DropForeignKey(
                name: "fk_word_audio_clips_prons_pron_word_id_pron_id",
                table: "word_audio_clips");

            migrationBuilder.DropIndex(
                name: "ix_pron_audio_clips_word_id_audio_clip_id",
                table: "pron_audio_clips");

            migrationBuilder.CreateIndex(
                name: "ix_word_audio_clips_audio_clip_id",
                table: "word_audio_clips",
                column: "audio_clip_id");

            migrationBuilder.CreateIndex(
                name: "ix_pron_audio_clips_audio_clip_id",
                table: "pron_audio_clips",
                column: "audio_clip_id");

            migrationBuilder.AddForeignKey(
                name: "fk_pron_audio_clips_audio_clips_audio_clip_id",
                table: "pron_audio_clips",
                column: "audio_clip_id",
                principalTable: "audio_clips",
                principalColumn: "audio_clip_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_pron_audio_clips_prons_word_id_pron_id",
                table: "pron_audio_clips",
                columns: new[] { "word_id", "pron_id" },
                principalTable: "prons",
                principalColumns: new[] { "word_id", "pron_id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_word_audio_clips_audio_clips_audio_clip_id",
                table: "word_audio_clips",
                column: "audio_clip_id",
                principalTable: "audio_clips",
                principalColumn: "audio_clip_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_word_audio_clips_words_word_id",
                table: "word_audio_clips",
                column: "word_id",
                principalTable: "words",
                principalColumn: "word_id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pron_audio_clips_audio_clips_audio_clip_id",
                table: "pron_audio_clips");

            migrationBuilder.DropForeignKey(
                name: "fk_pron_audio_clips_prons_word_id_pron_id",
                table: "pron_audio_clips");

            migrationBuilder.DropForeignKey(
                name: "fk_word_audio_clips_audio_clips_audio_clip_id",
                table: "word_audio_clips");

            migrationBuilder.DropForeignKey(
                name: "fk_word_audio_clips_words_word_id",
                table: "word_audio_clips");

            migrationBuilder.DropIndex(
                name: "ix_word_audio_clips_audio_clip_id",
                table: "word_audio_clips");

            migrationBuilder.DropIndex(
                name: "ix_pron_audio_clips_audio_clip_id",
                table: "pron_audio_clips");

            migrationBuilder.CreateIndex(
                name: "ix_pron_audio_clips_word_id_audio_clip_id",
                table: "pron_audio_clips",
                columns: new[] { "word_id", "audio_clip_id" });

            migrationBuilder.AddForeignKey(
                name: "fk_pron_audio_clips_prons_word_id_pron_id",
                table: "pron_audio_clips",
                columns: new[] { "word_id", "audio_clip_id" },
                principalTable: "prons",
                principalColumns: new[] { "word_id", "pron_id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_word_audio_clips_prons_pron_word_id_pron_id",
                table: "word_audio_clips",
                columns: new[] { "word_id", "audio_clip_id" },
                principalTable: "prons",
                principalColumns: new[] { "word_id", "pron_id" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
