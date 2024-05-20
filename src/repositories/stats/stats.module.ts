import {StatsService} from "./stats.service";
import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import { Stats } from './entity/stats.entity';
import {statsRedisService} from "../statsRedis/statsRedis.service";
import {statsRedis} from "../statsRedis/statsRedis.module";
import {geoRedis} from "../geoRedis/geoRedis.module";
import {geoRedisService} from "../geoRedis/geoRedis.service";
import {creativeRedisService} from "../creativeRedis/creativeRedis.service";
import {creoRedis} from "../creativeRedis/creativeRedis.module";

@Module({
    imports: [ClickHouseModule.forFeature([Stats]), statsRedis, geoRedis,creoRedis],
    controllers: [StatsController],
    providers: [StatsService, statsRedisService, geoRedisService, creativeRedisService],
    exports: [StatsModule],
})
export class StatsModule {}