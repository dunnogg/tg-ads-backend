import { Inject, Injectable } from '@nestjs/common';
import { StatsModel } from './entity/stats.entity';
import { Stat } from "./interfaces/stats.interface";

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

    async getStatByAdId(id: string) {
        const avgtime = await this.chClient.find({
            select: `avg(CAST(time AS Float64)) AS avgtime`,
            where: `ad = '${id}'`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND ad = '${id}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async getStatByPlatform(url: string) {
        const avgtime = await this.chClient.find({
            select: `avg(CAST(time AS Float64)) AS avgtime`,
            where: `platform = '${url}'`
        });
        let stats = await this.chClient.find({
            where: `action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND platform = '${url}'`,
            select: `action, count(*) AS total`,
            groupBy: 'action'
        })
        return stats.concat(avgtime);
    }

    async recordStat(stat: Stat) {
        const response = await this.chClient
            .create({
                id: ++this.countStats,
                ad: stat.ad,
                platform: stat.platform,
                date: Date.now().toString(),
                userdata: stat.userdata,
                action: stat.stat_name,
                time: String(stat.time)
            })
            .then(null, () => this.countStats--);
        return `Success create ${response}`;
    }
}