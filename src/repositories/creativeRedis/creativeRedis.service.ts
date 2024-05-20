import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class creativeRedisService {
    private readonly redis: Redis

    constructor(
        @Inject('creative')
        private readonly redisCreo: Redis,
    ) {
        this.redis = redisCreo;
    }

    async addCreative(uid: string, creative: any) {
        return this.redisCreo.set(uid, creative, 'EX', 120)
    }
    async getCreative(id: string) {
        return await this.redisCreo.get(id);
    }
}
