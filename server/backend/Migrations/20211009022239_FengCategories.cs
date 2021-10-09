using Microsoft.EntityFrameworkCore.Migrations;

namespace Yngdieng.Backend.Migrations
{
    public partial class FengCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "feng_category_id",
                table: "words",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "feng_categories",
                columns: table => new
                {
                    id = table.Column<string>(nullable: false),
                    level_one_name = table.Column<string>(nullable: false),
                    level_two_name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_feng_categories", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_words_feng_category_id",
                table: "words",
                column: "feng_category_id");

            migrationBuilder.AddForeignKey(
                name: "fk_words_feng_categories_feng_category_id",
                table: "words",
                column: "feng_category_id",
                principalTable: "feng_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_words_feng_categories_feng_category_id",
                table: "words");

            migrationBuilder.DropTable(
                name: "feng_categories");

            migrationBuilder.DropIndex(
                name: "ix_words_feng_category_id",
                table: "words");

            migrationBuilder.DropColumn(
                name: "feng_category_id",
                table: "words");
        }
    }
}
