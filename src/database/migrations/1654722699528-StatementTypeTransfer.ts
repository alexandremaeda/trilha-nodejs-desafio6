import { MigrationInterface, QueryRunner } from "typeorm";

export class StatementTypeTransfer1654722699528 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE statements_type_enum ADD VALUE 'transfer';`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // ! not implemented
    // alter table my_table alter my_col type text;
    // drop type my_enum;
    // create type my_enum as enum('apple', 'pear');
    // alter table my_table alter my_col type my_enum using my_col::my_enum;
  }
}
