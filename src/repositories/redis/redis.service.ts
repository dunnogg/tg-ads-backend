import {Inject, Injectable} from '@nestjs/common';
import {RedisClientType, RedisFunctions, RedisModules, RedisScripts} from 'redis';
import {StatName} from "../stats/interfaces/stats.interface";

@Injectable()
export class RedisService {
    private readonly redis: RedisClientType<
        RedisModules,
        RedisFunctions,
        RedisScripts
    >;

    constructor(
        @Inject('REDIS_CLIENT')
            redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>,
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
