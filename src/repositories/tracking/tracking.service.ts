import {Inject, Injectable} from '@nestjs/common';
import {TrackModel} from './entity/tracking.entity';
import {trackingRedisService} from "../trackingRedis/trackingRedis.service";
import {ActionName} from "./interfaces/tracking.interface";


@Injectable()
export class TrackingService {
    constructor(
        @Inject('Tracking')
        private readonly chClient: TrackModel,
        private readonly redisService: trackingRedisService,
    ) {
    }
    async getDataFromRedis() {
        const [keys, data] = await this.redisService.getData();
        const statsByActions = {};

        for (let i = 0; i<keys.length; i++) {
            const [ad, action] = keys[i].split(':');

            if (!statsByActions[ad]) {
                statsByActions[ad] = {};
            }

            statsByActions[ad][action] = data[i];
        }
        return statsByActions;
    }
    async recordStat(adid: string, userid: string, eventAction: ActionName) {
        return `Success create ${eventAction}`;
    }
}