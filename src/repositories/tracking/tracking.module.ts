import {TrackingService} from "./tracking.service";
import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import {Tracking} from "./entity/tracking.entity";
import {trackingRedisService} from "../trackingRedis/trackingRedis.service";
import {trackingRedis} from "../trackingRedis/trackingRedis.module";

@Module({
    imports: [ClickHouseModule.forFeature([Tracking]), trackingRedis],
    controllers: [TrackingController],
    providers: [TrackingService,trackingRedisService],
    exports: [TrackingModule],
})
export class TrackingModule {}