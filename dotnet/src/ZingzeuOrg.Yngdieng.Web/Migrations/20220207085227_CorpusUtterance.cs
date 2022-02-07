using Microsoft.EntityFrameworkCore.Migrations;

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "preferred_corpus_utterance_id",
                table: "words");

            migrationBuilder.DropColumn(
                name: "preferred_corpus_utterance_preview_url",
                table: "words");
        }
    }
}
