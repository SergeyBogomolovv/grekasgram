import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(helmet());

  const openApiConfig = new DocumentBuilder()
    .setTitle('Online Chat Api')
    .setDescription('This is the api for online chat')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(
    cors({
      credentials: true,
      origin: config.get('CORS_ORIGIN'),
    }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  await app.listen(config.get('PORT'));
}
bootstrap();
