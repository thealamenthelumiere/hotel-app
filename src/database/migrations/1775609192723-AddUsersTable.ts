import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1775609192723 implements MigrationInterface {
    name = 'AddUsersTable1775609192723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_8bf09ba754322ab9c22a215c91" UNIQUE ("userId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "guests" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "guests" ADD CONSTRAINT "UQ_3d9c9c94aa8328d2f3e8e1fa918" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "guests" ADD CONSTRAINT "FK_3d9c9c94aa8328d2f3e8e1fa918" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8bf09ba754322ab9c22a215c919" FOREIGN KEY ("userId") REFERENCES "guests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "guests" DROP CONSTRAINT "FK_3d9c9c94aa8328d2f3e8e1fa918"`);
        await queryRunner.query(`ALTER TABLE "guests" DROP CONSTRAINT "UQ_3d9c9c94aa8328d2f3e8e1fa918"`);
        await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
