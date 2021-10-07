using Microsoft.EntityFrameworkCore.Migrations;

namespace Yngdieng.Backend.Migrations
{
    public partial class Feng : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "feng_words",
                columns: table => new
                {
                    page_number = table.Column<int>(nullable: false),
                    line_number = table.Column<int>(nullable: false),
                    hanzi_raw = table.Column<string>(nullable: false),
                    hanzi_original = table.Column<string>(nullable: false),
                    hanzi_clean = table.Column<string>(nullable: false),
                    pron_underlying = table.Column<string>(nullable: false),
                    pron_sandhi = table.Column<string>(nullable: false),
                    explanation_raw = table.Column<string>(nullable: false),
                    explanation_parsed = table.Column<string>(nullable: true),
                    word_id = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_feng_words", x => new { x.page_number, x.line_number });
                    table.ForeignKey(
                        name: "fk_feng_words_words_word_id",
                        column: x => x.word_id,
                        principalTable: "words",
                        principalColumn: "word_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_feng_words_word_id",
                table: "feng_words",
                column: "word_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "feng_words");
        }
    }
}
