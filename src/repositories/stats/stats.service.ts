import {Inject, Injectable} from '@nestjs/common';
import {StatsModel} from './entity/stats.entity';
import {Stat} from "./interfaces/stats.interface";
import {statsRedisService} from "../statsRedis/statsRedis.service";
import {geoRedisService} from "../geoRedis/geoRedis.service";
import {creativeRedisService} from "../creativeRedis/creativeRedis.service";


@Injectable()
export class StatsService {
    private countStats:  number;
    private recordedData: Record<string, string> = {};
    constructor(
        @Inject('Stats')
        private readonly chClient: StatsModel,
        private readonly redisService: statsRedisService,
        private readonly redisIpService: geoRedisService,
        private readonly redisCreo: creativeRedisService
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
    async getIpData(ip: string, userId: string) {
        const data = await this.redisIpService.getIpInfo(userId)
        if (!data || (data['query'] !== ip)) {
            const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,mobile,proxy,hosting,query`)
            const ipInfo = await response.json()
            try {
                this.redisIpService.addIpInfo(ipInfo, userId)
            } catch (e) {
                console.error(e)
            }
            return ipInfo
        }
        else {
            return data
        }
    };
    async getCreative(id: string) {
        return this.redisCreo.getCreative(id)
    }
    async addCreative(id: string, xml: any) {
        return this.redisCreo.addCreative(id, xml)
    }
}