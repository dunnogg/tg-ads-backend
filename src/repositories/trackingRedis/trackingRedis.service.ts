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
        const keys = await this.redis.keys('*');
        const data = await this.redis.mget(keys);

        return [keys, data]
    }

    async incrStat(adId: string, action: string) {
        const key = `${adId}:${action}`;
        return this.redis.incr(key);
    }
}
