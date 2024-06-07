import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class batchRedisService {
    private readonly redis: Redis

    constructor(
        @Inject('batch')
        private readonly redisBatch: Redis,
    ) {
        this.redis = redisBatch;
    }


    async getData() {
        const maxKeys = 200;
        let cursor = '0';
        const keys: string[] = [];
        const pattern = `*`;

        // Scan for keys with a limit on the number of keys
        try {
            do {
                const result = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', maxKeys);
                cursor = result[0];
                keys.push(...result[1]);
            } while (cursor !== '0' && keys.length < maxKeys);
        } catch (error) {
            console.error('Error scanning Redis keys:', error);
            return [];
        }

        if (keys.length === 0) {
            return [];
        }

        const pipeline = this.redis.pipeline();
        keys.forEach(key => pipeline.get(key));

        let data;
        try {
            data = await pipeline.exec();
        } catch (error) {
            console.error('Error executing Redis pipeline:', error);
            return [];
        }

        const resultData: Array<{
            ad: string;
            action: string;
            userid: string;
            platform: string;
            timestamp: number;
            time: string;
        }> = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[i][1];  // Adjusted to access the value directly
            if (value) {
                try {
                    // Extract the components from the key
                    const [ad, action, userid, platform, timestamp, time] = key.split(';');

                    const parsedValue = JSON.parse(<string>value);
                    const entriesCount = parsedValue.value > 1 ? parsedValue.value : 1;
                    for (let j = 0; j < entriesCount; j++) {
                        resultData.push({
                            ad,
                            action,
                            userid,
                            platform,
                            timestamp: parseInt(timestamp, 10),  // Convert timestamp to number
                            time
                        });
                    }
                } catch (error) {
                    console.error(`Failed to parse value for key ${key}: ${value}`, error);
                }
            } else {
                console.warn(`Value for key ${key} is null or undefined`);
            }
        }

        return resultData;
    }

    async incrStats(records: { ad: string; action: string; userid: string; platform: string; timestamp: number; time: string }[]): Promise<void> {
        const pipeline = this.redis.pipeline();
        records.forEach(record => {
            const key = `${record.ad}:${record.action}:${record.userid}:${record.platform}:${record.timestamp}`;
            pipeline.incr(key);
        });

        await pipeline.exec();
    }
    async flushDB() {
        this.redis.flushdb()
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
    async incrStat(record: { ad: string; action: string; userid: string; platform: string; timestamp: number; time?: string }) {
        const key = `${record.ad};${record.action};${record.userid};${record.platform};${record.timestamp}:${String(record.time)}`;
        return this.redis.incr(key);
    }

}
