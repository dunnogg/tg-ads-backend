import {Injectable} from '@nestjs/common';
import {StatName} from "../stats/interfaces/stats.interface";
import {InjectRedis} from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    private readonly redis: Redis

    constructor(
        @InjectRedis()
            redisClient: Redis,
    ) {
        this.redis = redisClient;
    }

    async getKeys() {
        return await this.redis.keys('*');
    }

    async getAmount(key: string) {
        return await this.redis.get(key);
    }

    async incrStat(adId: string, action: StatName) {
        const key = `${adId}:${action}`;

        return await this.redis.incr(key);
    }
}
