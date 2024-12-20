import { Inject, Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import filesConfig from './config/files.config';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client;
  constructor(
    @Inject(filesConfig.KEY)
    cloudConfiguration: ConfigType<typeof filesConfig>,
    private readonly config: ConfigService,
  ) {
    this.s3Client = new S3Client(cloudConfiguration);
  }

  async uploadAvatar(userId: string, avatar: Express.Multer.File) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get('OBJECT_STORAGE_BUCKET'),
        Key: `users/${userId}/avatar.jpg`,
        Body: avatar.buffer,
        ContentType: avatar.mimetype,
      }),
    );

    return `https://${this.config.get('OBJECT_STORAGE_BUCKET')}.storage.yandexcloud.net/users/${userId}/avatar.jpg`;
  }

  async uploadImage(chatId: string, image: Express.Multer.File) {
    const fileName = v4();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.get('OBJECT_STORAGE_BUCKET'),
        Key: `chats/${chatId}/${fileName}.jpg`,
        Body: image.buffer,
        ContentType: image.mimetype,
      }),
    );

    return `https://${this.config.get('OBJECT_STORAGE_BUCKET')}.storage.yandexcloud.net/chats/${chatId}/${fileName}.jpg`;
  }
}
