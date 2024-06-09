import {RtbService} from "./rtb.service";
import {Module} from '@nestjs/common';
import { RtbController } from './rtb.controller';
import {geoRedisService} from "../repositories/geoRedis/geoRedis.service";
import {catsProviders} from "./providers/cats.providers";
import {TrackingModule} from "../repositories/tracking/tracking.module";
import {geoRedis} from "../repositories/geoRedis/geoRedis.module";

@Module({
    imports: [TrackingModule, geoRedis],
    controllers: [RtbController],
    providers: [RtbService, ...catsProviders],
    exports: [RtbService, ...catsProviders],
})
export class RtbModule {}