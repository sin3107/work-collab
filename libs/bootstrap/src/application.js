"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const expressBasicAuth = require("express-basic-auth");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressSession = require("express-session");
const morgan = require("morgan");
const path_1 = require("path");
const _common_1 = require("../../common/src");
class Application {
    constructor(server, configService, options) {
        this.server = server;
        this.configService = configService;
        this.options = options;
        this.logger = new common_1.Logger(Application.name);
        if (!this.configService.get('SECRET_KEY')) {
            this.logger.error('❌ SECRET_KEY is not defined in env');
            process.exit(1);
        }
    }
    setUpSwagger() {
        if (!this.options.enableSwagger || this.configService.get('NODE_ENV') === 'prod') {
            return;
        }
        const config = new swagger_1.DocumentBuilder()
            .setTitle(this.options.swaggerTitle)
            .setDescription(this.options.swaggerDescription || '')
            .addBearerAuth()
            .setVersion('1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(this.server, config);
        swagger_1.SwaggerModule.setup(`${this.options.swaggerPath}/docs`, this.server, document);
    }
    setUpBasicAuth() {
        this.server.use(['/docs', '/docs-json'], expressBasicAuth({
            challenge: true,
            users: {
                [this.configService.get('ADMIN_USER', 'admin')]: this.configService.get('ADMIN_PASSWORD', 'password'),
            },
        }));
    }
    async initializeApp() {
        this.server.enableCors({
            origin: this.configService.get('CORS_ORIGIN_LIST', '*')
                .split(',')
                .map((origin) => origin.trim()),
            credentials: true,
        });
        this.server.use(cookieParser());
        this.setUpBasicAuth();
        this.setUpSwagger();
        this.server.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        this.server.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(this.server.get(core_1.Reflector)), new _common_1.SuccessInterceptor());
        this.server.useGlobalFilters(new _common_1.AllExceptionsFilter());
        if (this.options.enableSession) {
            this.server.use(expressSession({
                secret: this.configService.get('SECRET_KEY'),
                resave: false,
                saveUninitialized: false,
            }));
            this.server.use(passport.initialize());
            this.server.use(passport.session());
        }
        this.server.use(morgan('dev'));
        if (this.options.enableView) {
            this.server.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
            this.server.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
            this.server.setViewEngine('hbs');
        }
    }
    async bootstrap() {
        await this.initializeApp();
        const port = parseInt(this.configService.get('PORT', '3000'), 10);
        await this.server.listen(port);
    }
    startLog() {
        const port = this.configService.get('PORT', '3000');
        this.logger.log(`🚀 Server started on http://localhost:${port}`);
    }
}
exports.Application = Application;
//# sourceMappingURL=application.js.map