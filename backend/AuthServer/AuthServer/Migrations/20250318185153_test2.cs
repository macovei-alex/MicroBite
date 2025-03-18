using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthServer.Migrations
{
    /// <inheritdoc />
    public partial class test2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_account_authentication_recovery_AuthenticationRecoveryId",
                table: "account");

            migrationBuilder.DropForeignKey(
                name: "FK_account_role_RoleId",
                table: "account");

            migrationBuilder.DropPrimaryKey(
                name: "PK_role",
                table: "role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_authentication_recovery",
                table: "authentication_recovery");

            migrationBuilder.DropPrimaryKey(
                name: "PK_account",
                table: "account");

            migrationBuilder.RenameTable(
                name: "role",
                newName: "Role");

            migrationBuilder.RenameTable(
                name: "authentication_recovery",
                newName: "AuthenticationRecoveries");

            migrationBuilder.RenameTable(
                name: "account",
                newName: "Accounts");

            migrationBuilder.RenameIndex(
                name: "IX_account_RoleId",
                table: "Accounts",
                newName: "IX_Accounts_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_account_AuthenticationRecoveryId",
                table: "Accounts",
                newName: "IX_Accounts_AuthenticationRecoveryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Role",
                table: "Role",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuthenticationRecoveries",
                table: "AuthenticationRecoveries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Accounts",
                table: "Accounts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_AuthenticationRecoveries_AuthenticationRecoveryId",
                table: "Accounts",
                column: "AuthenticationRecoveryId",
                principalTable: "AuthenticationRecoveries",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Role_RoleId",
                table: "Accounts",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_AuthenticationRecoveries_AuthenticationRecoveryId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Role_RoleId",
                table: "Accounts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Role",
                table: "Role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuthenticationRecoveries",
                table: "AuthenticationRecoveries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Accounts",
                table: "Accounts");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "role");

            migrationBuilder.RenameTable(
                name: "AuthenticationRecoveries",
                newName: "authentication_recovery");

            migrationBuilder.RenameTable(
                name: "Accounts",
                newName: "account");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_RoleId",
                table: "account",
                newName: "IX_account_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_AuthenticationRecoveryId",
                table: "account",
                newName: "IX_account_AuthenticationRecoveryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_role",
                table: "role",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_authentication_recovery",
                table: "authentication_recovery",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_account",
                table: "account",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_account_authentication_recovery_AuthenticationRecoveryId",
                table: "account",
                column: "AuthenticationRecoveryId",
                principalTable: "authentication_recovery",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_account_role_RoleId",
                table: "account",
                column: "RoleId",
                principalTable: "role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
