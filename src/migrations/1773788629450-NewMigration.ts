import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1773788629450 implements MigrationInterface {
    name = 'NewMigration1773788629450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "phone" character varying(20), CONSTRAINT "UQ_85d472bf0e9dd55ce9a8268c3e0" UNIQUE ("email"), CONSTRAINT "PK_4948267e93869ddcc6b340a2c46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying NOT NULL, "type" character varying(50) NOT NULL, "pricePerNight" numeric(10,2) NOT NULL, "capacity" integer NOT NULL, "description" text, CONSTRAINT "UQ_82a975f8999493b4cf1fbd9f880" UNIQUE ("number"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "paymentDate" TIMESTAMP NOT NULL DEFAULT now(), "method" character varying(50) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "booking_id" uuid, CONSTRAINT "REL_e86edf76dc2424f123b9023a2b" UNIQUE ("booking_id"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkInDate" date NOT NULL, "checkOutDate" date NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "totalPrice" numeric(10,2) NOT NULL, "guest_id" uuid, "room_id" uuid, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_services" ("booking_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_12f15721492a512bc6165c44426" PRIMARY KEY ("booking_id", "service_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_813fb23d7e327b6d9cff929cce" ON "booking_services" ("booking_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6e853453a3c24df1beed35c13e" ON "booking_services" ("service_id") `);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_b4403309538387262d97fdf2462" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_0b0fc32fe6bd0119e281628df7a" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_813fb23d7e327b6d9cff929cce6" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_6e853453a3c24df1beed35c13eb" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_services" DROP CONSTRAINT "FK_6e853453a3c24df1beed35c13eb"`);
        await queryRunner.query(`ALTER TABLE "booking_services" DROP CONSTRAINT "FK_813fb23d7e327b6d9cff929cce6"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_0b0fc32fe6bd0119e281628df7a"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_b4403309538387262d97fdf2462"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e853453a3c24df1beed35c13e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_813fb23d7e327b6d9cff929cce"`);
        await queryRunner.query(`DROP TABLE "booking_services"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "guests"`);
    }

}
