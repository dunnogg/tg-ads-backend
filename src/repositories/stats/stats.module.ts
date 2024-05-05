import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import {ClickHouseClient, ClickHouseConnectionProtocol, ClickHouseModule} from '@depyronick/nestjs-clickhouse';
import { StatsService } from './stats.service';
import * as process from "process";

@Module({
    imports: [
        ClickHouseModule.register([{
            host: `${process.env.CLICKHOUSE_HOST}`,
            username: `${process.env.CLICKHOUSE_USER}`,
            password: `${process.env.CLICKHOUSE_PASSWORD}`,
            name: `${process.env.CLICKHOUSE_DB}`,
            httpConfig: {
                protocol: ClickHouseConnectionProtocol.HTTPS,
            },
        }]),
    ],
    controllers: [StatsController],
    providers: [StatsService, ClickHouseClient], // Ваши сервис и сущность Stats
    exports: [StatsService], // Если StatsService должен быть доступен за пределами этого модуля
})
export class StatsModule {}
