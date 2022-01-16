using Microsoft.EntityFrameworkCore.Migrations;
using ZingzeuOrg.Yngdieng.Web.Db;

namespace ZingzeuOrg.Yngdieng.Web.Migrations
{
    public partial class SpeakersColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:extension_scope", "contrib,dragon_boat")
                .Annotation("Npgsql:Enum:gender", "unspecified,male,female")
                .Annotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .Annotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling")
                .OldAnnotation("Npgsql:Enum:extension_scope", "contrib,dragon_boat")
                .OldAnnotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .OldAnnotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling");

            migrationBuilder.AddColumn<string>(
                name: "accent",
                table: "speakers",
                nullable: true);

            migrationBuilder.AddColumn<Gender>(
                name: "gender",
                table: "speakers",
                nullable: false,
                defaultValue: Gender.UNSPECIFIED);

            migrationBuilder.AddColumn<int>(
                name: "year_of_birth",
                table: "speakers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "accent",
                table: "speakers");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "speakers");

            migrationBuilder.DropColumn(
                name: "year_of_birth",
                table: "speakers");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:extension_scope", "contrib,dragon_boat")
                .Annotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .Annotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling")
                .OldAnnotation("Npgsql:Enum:extension_scope", "contrib,dragon_boat")
                .OldAnnotation("Npgsql:Enum:gender", "unspecified,male,female")
                .OldAnnotation("Npgsql:Enum:sandhi_category", "unspecified,sandhi,bengzi")
                .OldAnnotation("Npgsql:Enum:variant", "unspecified,fuzhou_city,lianjiang,cikling");
        }
    }
}
