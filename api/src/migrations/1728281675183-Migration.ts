import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1728281675183 implements MigrationInterface {
  name = 'Migration1728281675183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "imageUrl" character varying, "fromId" uuid NOT NULL, "chatId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45bb3707fbb99a73e831fee41e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isGroup" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_07e65670b36d025a69930ae6f2e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "avatarUrl" character varying, "password" character varying NOT NULL, "about" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "online" boolean NOT NULL DEFAULT false, "lastOnlineAt" TIMESTAMP NOT NULL DEFAULT '"2024-10-07T06:14:36.365Z"', "emailConfirmed" TIMESTAMP, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Chat_Members" ("chatEntityId" uuid NOT NULL, "userEntityId" uuid NOT NULL, CONSTRAINT "PK_faa1bad6d095a43660b781b1a80" PRIMARY KEY ("chatEntityId", "userEntityId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdcdaaf96da3063e312896299b" ON "Chat_Members" ("chatEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7e45d73cf14d014a6bfb2d0c6" ON "Chat_Members" ("userEntityId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" ADD CONSTRAINT "FK_c5b8227c6d614856d489b516c84" FOREIGN KEY ("fromId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" ADD CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9" FOREIGN KEY ("chatId") REFERENCES "chat_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat_Members" ADD CONSTRAINT "FK_cdcdaaf96da3063e312896299bd" FOREIGN KEY ("chatEntityId") REFERENCES "chat_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat_Members" ADD CONSTRAINT "FK_c7e45d73cf14d014a6bfb2d0c6e" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Chat_Members" DROP CONSTRAINT "FK_c7e45d73cf14d014a6bfb2d0c6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat_Members" DROP CONSTRAINT "FK_cdcdaaf96da3063e312896299bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" DROP CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" DROP CONSTRAINT "FK_c5b8227c6d614856d489b516c84"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c7e45d73cf14d014a6bfb2d0c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdcdaaf96da3063e312896299b"`,
    );
    await queryRunner.query(`DROP TABLE "Chat_Members"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "chat_entity"`);
    await queryRunner.query(`DROP TABLE "message_entity"`);
  }
}
