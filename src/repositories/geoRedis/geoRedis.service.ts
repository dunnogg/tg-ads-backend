import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";
import {IpInfoDto} from "./dto/ipInfo.dto";

@Injectable()
export class geoRedisService {
    private readonly redis: Redis

    constructor(
        @Inject('geo')
        private readonly redisGeo: Redis,
    ) {
        this.redis = redisGeo;
    }

    async addIpInfo(ipData: IpInfoDto, userId: any) {
        const ipDataStringed: any = JSON.stringify(ipData)
        return this.redisGeo.set(userId, ipDataStringed, 'EX', 600)
    }
    async getIpInfo(id: string) {
        return await JSON.parse(await this.redisGeo.get(id));
    }
}
