"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const _bootstrap_1 = require("../../../libs/bootstrap/src");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const server = new _bootstrap_1.Application(app, configService, {
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
//# sourceMappingURL=main.js.map