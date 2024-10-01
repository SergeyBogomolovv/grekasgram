import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import filesConfig from './config/files.config';

@Module({
  imports: [ConfigModule.forFeature(filesConfig)],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
