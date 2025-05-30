import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Application } from '@bootstrap';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  const server = new Application(app, configService, {
    swaggerTitle: 'Auth Service API',
    swaggerPath: '/auth',
    enableSession: true,
    enableSwagger: true,
    enableView: false,
  });

  await server.bootstrap();
  server.startLog();
}

bootstrap().catch((e) => {
  console.error('Fatal error during bootstrap', e);
  process.exit(1);
});