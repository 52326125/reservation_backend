import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustDefault1710951385416 implements MigrationInterface {
    name = 'AdjustDefault1710951385416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_admin" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_frozen" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_frozen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_admin" DROP DEFAULT`);
    }

}
