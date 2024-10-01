import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService, ConfigType } from '@nestjs/config';
import filesConfig from './config/files.config';

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
}
