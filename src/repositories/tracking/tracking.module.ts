import {TrackingService} from "./tracking.service";
import {Module, OnModuleInit} from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import {Tracking} from "./entity/tracking.entity";
import {trackingRedisService} from "../trackingRedis/trackingRedis.service";
import {trackingRedis} from "../trackingRedis/trackingRedis.module";
import {BullmqFactory} from "../../bullmq/bullmq.factory";
import {batchRedisService} from "../batchRedis/batchRedis.service";
import {batchRedis} from "../batchRedis/batchRedis.module";

@Module({
    imports: [ClickHouseModule.forFeature([Tracking]), trackingRedis, batchRedis],
    controllers: [TrackingController],
    providers: [TrackingService,trackingRedisService, BullmqFactory, batchRedisService],
    exports: [TrackingModule],
})
export class TrackingModule implements OnModuleInit {
    constructor(private readonly trackingService: TrackingService) {}

    async onModuleInit() {
        await this.trackingService.getDataFromRedis();
    }
}