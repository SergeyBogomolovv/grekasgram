import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import AppDataSource from './data-source';
import { UserEntity } from './users/entities/user.entity';
import { MessageEntity } from './messages/entities/message.entity';
import { ChatEntity } from './chats/entities/chat.entity';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().integer().required(),
        POSTGRES_HOST: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().integer().required(),

        JWT_SECRET: Joi.string().required(),

        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().integer().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),

        OBJECT_STORAGE_REGION: Joi.string().required(),
        OBJECT_STORAGE_ENDPOINT: Joi.string().required(),
        OBJECT_STORAGE_ACCESS: Joi.string().required(),
        OBJECT_STORAGE_SECRET: Joi.string().required(),
        OBJECT_STORAGE_BUCKET: Joi.string().required(),

        PORT: Joi.number().integer().required(),
        CORS_ORIGIN: Joi.string().required(),
      }),
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 0,
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        });
        return { store };
      },
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [UserEntity, MessageEntity, ChatEntity],
    }),

    TerminusModule.forRoot({ gracefulShutdownTimeoutMs: 1000 }),

    MailModule,
    FilesModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    AuthModule,
  ],
})
export class AppModule {}
