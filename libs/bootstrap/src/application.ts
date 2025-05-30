import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

import * as expressBasicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import * as morgan from 'morgan';
import { join } from 'path';

import { AllExceptionsFilter, SuccessInterceptor } from '@common';

interface AppOptions {
  swaggerTitle: string;
  swaggerPath: string;
  swaggerDescription?: string;
  enableSession?: boolean;
  enableSwagger?: boolean;
  enableView?: boolean;
}

export class Application {
  private logger = new Logger(Application.name);

  constructor(
    private server: NestExpressApplication,
    private configService: ConfigService,
    private options: AppOptions,
  ) {
    if (!this.configService.get<string>('SECRET_KEY')) {
      this.logger.error('❌ SECRET_KEY is not defined in env');
      process.exit(1);
    }
  }

  private setUpSwagger(): void {
    if (!this.options.enableSwagger || this.configService.get('NODE_ENV') === 'prod') {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(this.options.swaggerTitle)
      .setDescription(this.options.swaggerDescription || '')
      .addBearerAuth()
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(this.server, config);
    SwaggerModule.setup(`${this.options.swaggerPath}/docs`, this.server, document);
  }

  private setUpBasicAuth(): void {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.configService.get('ADMIN_USER', 'admin')]:
            this.configService.get('ADMIN_PASSWORD', 'password'),
        },
      }),
    );
  }

  private async initializeApp(): Promise<void> {
    this.server.enableCors({
      origin: this.configService.get<string>('CORS_ORIGIN_LIST', '*')
        .split(',')
        .map((origin) => origin.trim()),
      credentials: true,
    });

    this.server.use(cookieParser());

    this.setUpBasicAuth();
    this.setUpSwagger();

    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
      new SuccessInterceptor(),
    );
    this.server.useGlobalFilters(new AllExceptionsFilter());

    if (this.options.enableSession) {
      this.server.use(
        expressSession({
          secret: this.configService.get('SECRET_KEY'),
          resave: false,
          saveUninitialized: false,
        }),
      );
      this.server.use(passport.initialize());
      this.server.use(passport.session());
    }

    this.server.use(morgan('dev'));

    if (this.options.enableView) {
      this.server.setBaseViewsDir(join(__dirname, '..', 'views'));
      this.server.useStaticAssets(join(__dirname, '..', 'public'));
      this.server.setViewEngine('hbs');
    }
  }

  async bootstrap(): Promise<void> {
    await this.initializeApp();
    const port = parseInt(this.configService.get('PORT', '3000'), 10);
    await this.server.listen(port);
  }

  startLog(): void {
    const port = this.configService.get('PORT', '3000');
    this.logger.log(`🚀 Server started on http://localhost:${port}`);
  }
}
