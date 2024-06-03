import { Module } from '@nestjs/common';
import {BullmqService} from "./bullmq.service";
import {TrackingService} from "../repositories/tracking/tracking.service";
import {BullmqFactory} from "./bullmq.factory";
import {TrackingModule} from "../repositories/tracking/tracking.module";

@Module({
    imports: [TrackingService, TrackingModule],
    providers: [BullmqService, TrackingService, BullmqFactory],
    exports: [BullmqService, BullmqFactory],
})
export class BullMQModule {}
