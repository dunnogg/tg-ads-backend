import {Inject, Injectable} from '@nestjs/common';
import {StatsModel} from './entity/stats.entity';
import {Stat} from "./interfaces/stats.interface";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class StatsService {
    private countStats:  number;
    constructor(
        @Inject('Stats')
        private readonly chClient: StatsModel,
        private readonly redisService: RedisService,
    ) {}

    async getStatsByAdId(id: string) {
        const avgtime = await this.chClient.find({
            select: `avg(toFloat64OrNull(time)) AS time`,
            where: `ad = '${id}' AND (action = 'Watched to the end' OR action = 'close')`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND ad = '${id}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async getAllAdsStats() {
        const query = {
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end')`,
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
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND platform = '${url}'`,
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

    async getStatsData() {
        const keys = await this.redisService.getKeys();
        const statsByActions = {};
        const time = Date.now();
        for (const key of keys) {
            console.log(key)
            const [ad, action] = key.split(':');
            const amount = await this.redisService.getAmount(key);
            if (!statsByActions[ad]){
                statsByActions[ad] = {}
            }

            statsByActions[ad][action] = amount.toString();
        }
        console.log(Date.now()-time)
        return statsByActions;
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