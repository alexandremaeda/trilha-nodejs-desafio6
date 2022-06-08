import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class StatementSends1654729104716 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "statements",
      new TableForeignKey({
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("statements");
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("sender_id") !== -1
    );

    await queryRunner.dropForeignKey("statements", foreignKey!);

    await queryRunner.dropColumn("statements", "sender_id");
  }
}
