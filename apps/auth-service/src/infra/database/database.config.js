"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('AUTH_DB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map