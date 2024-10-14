import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728910548385 implements MigrationInterface {
    name = 'Migration1728910548385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "device" character varying NOT NULL, "ip" character varying NOT NULL, "loginedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_a78813e06745b2c5d5b9776bfcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "viewed" boolean NOT NULL DEFAULT false, "fromId" uuid NOT NULL, "chatId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "avatarUrl" character varying, "password" character varying NOT NULL, "about" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "online" boolean NOT NULL DEFAULT false, "lastOnlineAt" TIMESTAMP NOT NULL DEFAULT '"2024-10-14T12:55:49.572Z"', "emailConfirmed" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_members" ("chatId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_d37a7c4be404903dd6fd46f696b" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e98bf961346b1b32adf306136c" ON "chat_members" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_23c13a72d263e5f355aef4e2a0" ON "chat_members" ("userId") `);
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" ADD CONSTRAINT "FK_ebf65cd067163c7c66baa3da1c1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_776000050f42ddb61d3c628ff16" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_e98bf961346b1b32adf306136c6" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d"`);
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_e98bf961346b1b32adf306136c6"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_776000050f42ddb61d3c628ff16"`);
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" DROP CONSTRAINT "FK_ebf65cd067163c7c66baa3da1c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23c13a72d263e5f355aef4e2a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e98bf961346b1b32adf306136c"`);
        await queryRunner.query(`DROP TABLE "chat_members"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
    }

}
