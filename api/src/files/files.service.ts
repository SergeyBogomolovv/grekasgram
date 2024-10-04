import { Inject, Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import filesConfig from './config/files.config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

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
}
