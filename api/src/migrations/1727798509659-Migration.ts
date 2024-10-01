import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1727798509659 implements MigrationInterface {
  name = 'Migration1727798509659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "emailConfirmed" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_07e65670b36d025a69930ae6f2e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fromId" uuid, "chatId" uuid, CONSTRAINT "PK_45bb3707fbb99a73e831fee41e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users_Chats" ("chatEntityId" uuid NOT NULL, "userEntityId" uuid NOT NULL, CONSTRAINT "PK_6d2d0bc02afb4cf1a162794704c" PRIMARY KEY ("chatEntityId", "userEntityId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93a0102d2c63099e7bbdeb0d5b" ON "Users_Chats" ("chatEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_539fca0c7b8679990e6c889234" ON "Users_Chats" ("userEntityId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" ADD CONSTRAINT "FK_c5b8227c6d614856d489b516c84" FOREIGN KEY ("fromId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" ADD CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9" FOREIGN KEY ("chatId") REFERENCES "chat_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users_Chats" ADD CONSTRAINT "FK_93a0102d2c63099e7bbdeb0d5b7" FOREIGN KEY ("chatEntityId") REFERENCES "chat_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users_Chats" ADD CONSTRAINT "FK_539fca0c7b8679990e6c8892341" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users_Chats" DROP CONSTRAINT "FK_539fca0c7b8679990e6c8892341"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users_Chats" DROP CONSTRAINT "FK_93a0102d2c63099e7bbdeb0d5b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" DROP CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_entity" DROP CONSTRAINT "FK_c5b8227c6d614856d489b516c84"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_539fca0c7b8679990e6c889234"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93a0102d2c63099e7bbdeb0d5b"`,
    );
    await queryRunner.query(`DROP TABLE "Users_Chats"`);
    await queryRunner.query(`DROP TABLE "message_entity"`);
    await queryRunner.query(`DROP TABLE "chat_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
