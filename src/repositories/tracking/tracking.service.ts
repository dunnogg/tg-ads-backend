import {Inject, Injectable} from '@nestjs/common';
import {TrackModel} from './entity/tracking.entity';
import {trackingRedisService} from "../trackingRedis/trackingRedis.service";
import {getFormattedData} from "./utils/getFormattedData";
import {addDelayedJob} from "bullmq/dist/esm/scripts";


@Injectable()
export class TrackingService {
    constructor(
        @Inject('Tracking')
        private readonly chClient: TrackModel,
        private readonly redisService: trackingRedisService,

    ) {
        this.redisService = redisService;

    }
    async getDataFromRedis() {
        const [keys, data] = await this.redisService.getData();
        if (keys === undefined) {
            const chdata: any = await this.chClient.find({
                select: `ad, action, userid, platform, count(*) AS total`,
                groupBy: 'ad, action, userid, platform'
            });
            const chKeys = chdata.map(row => `${row.ad}:${row.action}:${row.userid}:${row.platform}`);
            const chData = chdata.map(row => row.total);
            await this.redisService.setData(chKeys, chData);

            return getFormattedData(chKeys, chData);
        }
        return getFormattedData(keys, data);
    }
    async getDataForUserFromRedis(userid: string) {
        const [keys, data] = await this.redisService.getDataForUser(userid)
        return getFormattedData(keys, data)
    }
    async getDataForAdFromRedis(ad: string) {
        const [keys, data] = await this.redisService.getDataForAd(ad)
        return getFormattedData(keys, data)
    }

    async getDataForPlatformFromRedis(platform: string) {
        const [keys, data] = await this.redisService.getDataForPlatform(platform)
        return getFormattedData(keys, data)
    }
    async recordStat(JobData: any) {
        const response = await this.redisService.incrStats(JobData);
        /*const response = await this.chClient.insertMany(JobData)*/
        return `Success create`;
    }
}