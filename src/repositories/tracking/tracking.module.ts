import {TrackingService} from "./tracking.service";
import {Module, OnModuleInit} from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { ClickHouseModule } from '@oneralon/nestjs-clickhouse';
import {Tracking} from "./entity/tracking.entity";
import {trackingRedisService} from "../trackingRedis/trackingRedis.service";
import {trackingRedis} from "../trackingRedis/trackingRedis.module";
import {BullmqFactory} from "../../bullmq/bullmq.factory";

@Module({
    imports: [ClickHouseModule.forFeature([Tracking]), trackingRedis],
    controllers: [TrackingController],
    providers: [TrackingService,trackingRedisService, BullmqFactory],
    exports: [TrackingModule],
})
export class TrackingModule implements OnModuleInit {
    constructor(private readonly trackingService: TrackingService) {}

    async onModuleInit() {
        await this.trackingService.getDataFromRedis();
    }
}