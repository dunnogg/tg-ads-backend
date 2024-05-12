import {Inject, Injectable} from '@nestjs/common';
import {StatsModel} from './entity/stats.entity';
import {Stat} from "./interfaces/stats.interface";
import {RedisService} from "../redis/redis.service";
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path';
import fs = require('fs')
import process from "process";

@Injectable()
export class StatsService {
    private countStats:  number;
    constructor(
        @Inject('Stats')
        private readonly chClient: StatsModel,
        private readonly redisService: RedisService,
    ) {

    }

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
        const limits: Record<string, string> = JSON.parse(await readFile("./numbers.json", "utf8"));
        const statsByActions = {};

        for (const [key, amount] of Object.entries(limits)) {
            const [ad, action] = key.split(':');
            if (!statsByActions[ad]){
                statsByActions[ad] = {}
            }

            statsByActions[ad][action] = amount;
        }

        return statsByActions;
    }

    async recordStat(stat: Stat) {
        if (!fs.existsSync("./numbers.json")){
            fs.writeFileSync("./numbers.json", JSON.stringify({}),'utf8')
        }

        await this.redisService.incrStat(stat.ad, stat.action);
        const limits: Record<string, string> = JSON.parse(await readFile("./numbers.json", "utf8"));

        if (limits[stat.ad+':'+stat.action]) {
            limits[stat.ad+':'+stat.action] = (Number(limits[stat.ad+':'+stat.action]) + 1).toString();
        } else {
            limits[stat.ad+':'+stat.action] = '1';
        }

        await writeFile("./numbers.json", JSON.stringify(limits), 'utf8');

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