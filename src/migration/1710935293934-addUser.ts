import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1710935293934 implements MigrationInterface {
  name = 'AddUser1710935293934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "code" character varying(20) NOT NULL, "description" character varying(100) NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(16) NOT NULL, "password" character varying(60) NOT NULL, "nickname" character varying(32) NOT NULL, "is_admin" boolean NOT NULL, "email" character varying(32) NOT NULL, "is_frozen" boolean NOT NULL, "profile" character varying(50) NOT NULL, "create_time" TIMESTAMP NOT NULL DEFAULT now(), "update_time" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission_permission" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_601804d828ecf7c301022770fad" PRIMARY KEY ("roleId", "permissionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be73ed38a02ea01cef07836835" ON "role_permission_permission" ("roleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fff5824ba3354f53d4fae760c" ON "role_permission_permission" ("permissionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_permission" ADD CONSTRAINT "FK_be73ed38a02ea01cef07836835e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_permission" ADD CONSTRAINT "FK_1fff5824ba3354f53d4fae760c3" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_permission" DROP CONSTRAINT "FK_1fff5824ba3354f53d4fae760c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_permission" DROP CONSTRAINT "FK_be73ed38a02ea01cef07836835e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1fff5824ba3354f53d4fae760c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be73ed38a02ea01cef07836835"`,
    );
    await queryRunner.query(`DROP TABLE "role_permission_permission"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
