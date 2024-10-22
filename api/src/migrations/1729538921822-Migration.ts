import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729538921822 implements MigrationInterface {
    name = 'Migration1729538921822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "device" character varying NOT NULL, "ip" character varying NOT NULL, "loginedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "fromId" uuid NOT NULL, "chatId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "avatarUrl" character varying, "password" text NOT NULL, "about" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "online" boolean NOT NULL DEFAULT false, "lastOnlineAt" TIMESTAMP NOT NULL DEFAULT now(), "emailConfirmed" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message_viewed_by" ("messageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b40861038f4ca6410576dcf9118" PRIMARY KEY ("messageId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5630008d72fd19328fe4cbc6c8" ON "message_viewed_by" ("messageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb6d4827c6b042a63b6e5999fd" ON "message_viewed_by" ("userId") `);
        await queryRunner.query(`CREATE TABLE "chat_members" ("userId" uuid NOT NULL, "chatId" uuid NOT NULL, CONSTRAINT "PK_d37a7c4be404903dd6fd46f696b" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23c13a72d263e5f355aef4e2a0" ON "chat_members" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e98bf961346b1b32adf306136c" ON "chat_members" ("chatId") `);
        await queryRunner.query(`CREATE TABLE "user_favorites" ("userId" uuid NOT NULL, "chatId" uuid NOT NULL, CONSTRAINT "PK_35b75074e390170270a115be783" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1dd5c393ad0517be3c31a7af83" ON "user_favorites" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b57187b469b22bf1b3639064f5" ON "user_favorites" ("chatId") `);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_776000050f42ddb61d3c628ff16" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message_viewed_by" ADD CONSTRAINT "FK_5630008d72fd19328fe4cbc6c85" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_viewed_by" ADD CONSTRAINT "FK_bb6d4827c6b042a63b6e5999fd0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_e98bf961346b1b32adf306136c6" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_b57187b469b22bf1b3639064f5b" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_b57187b469b22bf1b3639064f5b"`);
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836"`);
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_e98bf961346b1b32adf306136c6"`);
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d"`);
        await queryRunner.query(`ALTER TABLE "message_viewed_by" DROP CONSTRAINT "FK_bb6d4827c6b042a63b6e5999fd0"`);
        await queryRunner.query(`ALTER TABLE "message_viewed_by" DROP CONSTRAINT "FK_5630008d72fd19328fe4cbc6c85"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_776000050f42ddb61d3c628ff16"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b57187b469b22bf1b3639064f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dd5c393ad0517be3c31a7af83"`);
        await queryRunner.query(`DROP TABLE "user_favorites"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e98bf961346b1b32adf306136c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23c13a72d263e5f355aef4e2a0"`);
        await queryRunner.query(`DROP TABLE "chat_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb6d4827c6b042a63b6e5999fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5630008d72fd19328fe4cbc6c8"`);
        await queryRunner.query(`DROP TABLE "message_viewed_by"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
