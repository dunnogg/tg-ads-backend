import {StatsService} from "./stats.service";
import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import { Stats } from './entity/stats.entity';
import {RedisService} from "../redis/redis.service";
import {Redis} from "../redis/redis.module";

@Module({
    imports: [ClickHouseModule.forFeature([Stats]), Redis],
    controllers: [StatsController],
    providers: [StatsService, RedisService],
    exports: [StatsModule],
})
export class StatsModule {}