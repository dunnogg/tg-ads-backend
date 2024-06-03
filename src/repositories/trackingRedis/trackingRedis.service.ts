import {Inject, Injectable} from '@nestjs/common';
import {InjectRedis} from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class trackingRedisService {
    private readonly redis: Redis

    constructor(
        @Inject('tracking')
        private readonly redisTracking: Redis,
    ) {
        this.redis = redisTracking;
    }

    async getData(){
        let cursor = '0';
        const keys: string[] = [];
        const pattern = `*`;

        do {
            const result = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
            cursor = result[0];
            keys.push(...result[1]);
        } while (cursor !== '0');

        if (keys.length === 0) {
            return [undefined, undefined];
        }

        const pipeline = this.redis.pipeline();
        keys.forEach(key => {
            pipeline.get(key);
        });

        const data = await pipeline.exec();
        const values = data.map(result => result[1]);
        return [keys, values];

    }

    async getDataForUser(userid: string){
        let cursor = '0';
        const keys: string[] = [];
        const pattern = `*:${userid}:*`;

        do {
            const result = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
            cursor = result[0];
            keys.push(...result[1]);
        } while (cursor !== '0');

        if (keys.length === 0) {
            return [undefined, undefined];
        }

        const pipeline = this.redis.pipeline();
        keys.forEach(key => {
            pipeline.get(key);
        });

        const data = await pipeline.exec();
        const values = data.map(result => result[1]);
        return [keys, values];
    }
    async getDataForAd(ad: string){
        let cursor = '0';
        const keys: string[] = [];
        const pattern = `${ad}*`;

        do {
            const result = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
            cursor = result[0];
            keys.push(...result[1]);
        } while (cursor !== '0');

        if (keys.length === 0) {
            return [undefined, undefined];
        }

        const pipeline = this.redis.pipeline();
        keys.forEach(key => {
            pipeline.get(key);
        });

        const data = await pipeline.exec();
        const values = data.map(result => result[1]);
        return [keys, values];
    }

    async getDataForPlatform(platform: string){
        let cursor = '0';
        const keys: string[] = [];
        const pattern = `*:${platform}`;

        do {
            const result = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
            cursor = result[0];
            keys.push(...result[1]);
        } while (cursor !== '0');

        if (keys.length === 0) {
            return [undefined, undefined];
        }

        const pipeline = this.redis.pipeline();
        keys.forEach(key => {
            pipeline.get(key);
        });

        const data = await pipeline.exec();
        const values = data.map(result => result[1]);
        return [keys, values];

    }

    async incrStats(records: { ad: string; action: string; userid: string; platform: string }[]): Promise<void> {
        const pipeline = this.redis.pipeline();
        records.forEach(record => {
            const key = `${record.ad}:${record.action}:${record.userid}:${record.platform}`;
            pipeline.incr(key);
        });

        await pipeline.exec();
    }
    async setData(keys: string[], data: any[]) {
        if (keys.length === 0 || data.length === 0) {
            throw new Error('Keys or data is empty');
        }

        const redisData: string[] = [];
        for (let i = 0; i < keys.length; i++) {
            redisData.push(keys[i], JSON.stringify(data[i]));
        }
        return new Promise<void>((resolve, reject) => {
            this.redis.mset(redisData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
