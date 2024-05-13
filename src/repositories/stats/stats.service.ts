import {Inject, Injectable} from '@nestjs/common';
import {StatsModel} from './entity/stats.entity';
import {Stat} from "./interfaces/stats.interface";
import {RedisService} from "../redis/redis.service";


@Injectable()
export class StatsService {
    private countStats:  number;
    private recordedData: Record<string, string> = {};
    constructor(
        @Inject('Stats')
        private readonly chClient: StatsModel,
        private readonly redisService: RedisService,
    ) {
    }

    async getDataFromRedis() {
        const time = Date.now()
        const [keys, data] = await this.redisService.getData();
        const statsByActions = {};

        for (let i = 0; i<keys.length; i++) {
            const [ad, action] = keys[i].split(':');

            if (!statsByActions[ad]) {
                statsByActions[ad] = {};
            }

            statsByActions[ad][action] = data[i];
        }
        console.log(Date.now() - time)
        return statsByActions;
    }

    async getStatsByAdId(id: string) {
        const avgtime = await this.chClient.find({
            select: `avg(toFloat64OrNull(time)) AS time`,
            where: `ad = '${id}' AND (action = 'Watched to the end' OR action = 'close')`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression', 'view', 'Watched to the end') AND ad = '${id}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async getAllAdsStats() {
        const query = {
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression', 'view', 'Watched to the end')`,
            select: `ad, action, count(*) AS total, avg(toFloat64OrNull(time)) AS avgtime`,
            groupBy: 'ad, action'
        };
        return await this.chClient.find(query);
    }

    async getStatsByPlatform(url: string) {
        const avgtime = await this.chClient.find({
            select: `avg(toFloat64OrNull(time)) AS time`,
            where: `platform = '${url}' AND (action = 'Watched to the end' OR action = 'close')`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression', 'view', 'Watched to the end') AND platform = '${url}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async getStatByPlatform(url: string, action: string) {
        return await this.chClient.find({
            where: `action IN ('${action}') AND platform = '${url}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
    }

    async getStatByAdId(id: string, action: string) {
        return await this.chClient.find({
            where: `action IN ('${action}') AND ad = '${id}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
    }

    async getStatByUserId(userId: string, action: string) {
        return await this.chClient.find({
            where: `action IN ('${action}') AND userid = '${userId}'`,
            select: `ad, action, count(*) AS total`,
            groupBy: 'ad, action'
        });
    }

    async recordStat(stat: Stat) {
        await this.redisService.incrStat(stat.ad, stat.action);

        const response = await this.chClient
            .create({
                timestamp: Date.now(),
                ad: stat.ad,
                platform: stat.platform,
                userdata: JSON.stringify(stat.userdata) || 'undefined',
                action: stat.action,
                time: String(stat.time) || null,
                userid: String(stat.userid)
            })
            .then(null, () => {this.countStats--});
        return `Success create ${response}`;
    }
}