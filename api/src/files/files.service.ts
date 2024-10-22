import { Inject, Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import filesConfig from './config/files.config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client;
  constructor(
    @Inject(filesConfig.KEY)
    cloudConfiguration: ConfigType<typeof filesConfig>,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.s3Client = new S3Client(cloudConfiguration);
  }

  async uploadAvatar(userId: string, avatar: Express.Multer.File) {
    this.eventEmitter.emit('upload-avatar', { userId, avatar });

    return `https://${this.config.get('OBJECT_STORAGE_BUCKET')}.storage.yandexcloud.net/users/${userId}/avatar.jpg`;
  }

  async uploadImage(chatId: string, image: Express.Multer.File) {
    const fileName = v4();
    this.eventEmitter.emit('upload-image', { chatId, image, fileName });

    return `https://${this.config.get('OBJECT_STORAGE_BUCKET')}.storage.yandexcloud.net/chats/${chatId}/${fileName}.jpg`;
  }

  @OnEvent('upload-avatar')
  async onUploadAvatar(payload: {
    userId: string;
    avatar: Express.Multer.File;
  }) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get('OBJECT_STORAGE_BUCKET'),
        Key: `users/${payload.userId}/avatar.jpg`,
        Body: payload.avatar.buffer,
        ContentType: payload.avatar.mimetype,
      }),
    );
  }

  @OnEvent('upload-image')
  async onUploadImage(payload: {
    chatId: string;
    image: Express.Multer.File;
    fileName: string;
  }) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get('OBJECT_STORAGE_BUCKET'),
        Key: `chats/${payload.chatId}/${payload.fileName}.jpg`,
        Body: payload.image.buffer,
        ContentType: payload.image.mimetype,
      }),
    );
  }
}
