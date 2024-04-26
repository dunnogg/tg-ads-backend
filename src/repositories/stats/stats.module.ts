import {StatsService} from "./stats.service";
import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import { Stats } from './entity/stats.entity';

@Module({
    imports: [ClickHouseModule.forFeature([Stats])],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsModule],
})
export class StatsModule {}

