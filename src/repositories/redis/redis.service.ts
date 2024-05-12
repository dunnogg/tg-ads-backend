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

    async getData(){
        const keys = await this.redis.keys('*');
        const data = await this.redis.mget(keys);

        return [keys, data]
    }

    async incrStat(adId: string, action: StatName) {
        const key = `${adId}:${action}`;

        return this.redis.incr(key);
    }
}
