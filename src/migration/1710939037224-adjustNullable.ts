import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustNullable1710939037224 implements MigrationInterface {
    name = 'AdjustNullable1710939037224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profile" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profile" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "description" SET NOT NULL`);
    }

}
