import { Inject, Injectable } from '@nestjs/common';
import { Stat } from "./interfaces/stats.interface";
import {ClickHouseClient} from "@depyronick/nestjs-clickhouse";
import * as process from "process";

@Injectable()
export class StatsService {
    private countStats: number;

    constructor(
        @Inject(`${process.env.CLICKHOUSE_DB}`)
        private readonly chClient: ClickHouseClient,
    ) {
        this.countStats = 0;
        this.initializeCountStats();
    }

    private async initializeCountStats() {
        try {
            const res = await this.chClient.query(`SELECT count(*) AS total FROM stats`);
            this.countStats = res[0].total;
        } catch (error) {
            console.error('Error initializing countStats:', error);
        }
    }

    async getStatsByAdId(id: string) {
        try {
            const avgtime = [await this.chClient.query(`SELECT avg(toFloat64OrNull(time)) AS time FROM stats WHERE ad = '${id}'`)];
            const stats = [await this.chClient.query(`SELECT action, count(*) AS total FROM stats WHERE action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND ad = '${id}' GROUP BY action`)];
            return stats.concat(avgtime);
        } catch (error) {
            console.error('Error fetching stats by ad id:', error);
            return [];
        }
    }

    async getStatsByPlatform(url: string) {
        try {
            const avgtime = [await this.chClient.query(`SELECT avg(toFloat64OrNull(time)) AS time FROM stats WHERE platform = '${url}'`)];
            const stats = [await this.chClient.query(`SELECT action, count(*) AS total FROM stats WHERE action IN ('open', 'close', 'mute', 'unmute', 'impression 10 sec', 'view', 'Watched to the end') AND platform = '${url}' GROUP BY action`)];
            return stats.concat(avgtime);
        } catch (error) {
            console.error('Error fetching stats by platform:', error);
            return [];
        }
    }

    async getStatByPlatform(url: string, action: string) {
        try {
            return await this.chClient.query(`SELECT action, count(*) AS total FROM stats WHERE action IN ('${action}') AND platform = '${url}' GROUP BY action`);
        } catch (error) {
            console.error('Error fetching stat by platform:', error);
            return [];
        }
    }

    async getStatByAdId(id: string, action: string) {
        try {
            return await this.chClient.query(`SELECT action, count(*) AS total FROM stats WHERE action IN ('${action}') AND ad = '${id}' GROUP BY action`);
        } catch (error) {
            console.error('Error fetching stat by ad id:', error);
            return [];
        }
    }

    async recordStat(stat: Stat) {
        try {
            const response = await this.chClient.query(`INSERT INTO stats (id, ad, platform, date, userdata, action, time) VALUES (${++this.countStats}, '${stat.ad}', '${stat.platform}', '${Date.now()}', '${JSON.stringify(stat.userdata) || 'undefined'}', '${stat.action}', ${stat.time || 'NULL'})`);
            return `Success create ${response}`;
        } catch (error) {
            console.error('Error recording stat:', error);
            this.countStats--;
            return `Error: ${error.message}`;
        }
    }
}
