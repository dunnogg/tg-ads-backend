import {Inject, Injectable} from '@nestjs/common';
import {StatsModel} from './entity/stats.entity';
import {Stat} from "./interfaces/stats.interface";

@Injectable()
export class StatsService {
    private countStats:  number;
    constructor(
        @Inject('Stats')
        private readonly chClient: StatsModel,
    ) {
        this.countStats = 0;
        this.chClient
            .find({
                select: `count(*) AS total`,
            })
            .then((res) => {
                this.countStats = res[0]['total'];
            });
    }

    async getStatsByAdId(id: string) {
        const avgtime = await this.chClient.find({
            select: `avg(toFloat64OrNull(time)) AS time`,
            where: `ad = '${id}'`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND ad = '${id}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async getAllAdsStats() {
        return await this.chClient.find({
            where: ` ad, groupArray((action, total)) AS stats, avg(toFloat64OrNull(time)) AS avgtime`,
            select: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end')`,
            groupBy: 'ad'
        });
    }

    async getStatsByPlatform(url: string) {
        const avgtime = await this.chClient.find({
            select: `avg(toFloat64OrNull(time)) AS time`,
            where: `platform = '${url}'`
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
    async getAllStats() {
        return await this.chClient.find({
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
    }
    async recordStat(stat: Stat) {
        const response = await this.chClient
            .create({
                id: ++this.countStats,
                ad: stat.ad,
                platform: stat.platform,
                date: Date.now().toString(),
                userdata: JSON.stringify(stat.userdata) || 'undefined',
                action: stat.action,
                time: String(stat.time) || null
            })
            .then(null, () => {this.countStats--});
        return `Success create ${response}`;
    }
}