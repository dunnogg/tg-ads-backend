import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import Redis from "ioredis";
import * as process from "process";



const redisGeo = {
    provide: 'geo',
    useFactory: () => new Redis(process.env.REDIS_GEO),
};

@Module({
    providers: [redisGeo],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: process.env.REDIS_GEO,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule, redisGeo],
})
export class geoRedis {}
