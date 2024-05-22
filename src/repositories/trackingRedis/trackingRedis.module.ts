import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import Redis from "ioredis";
import * as process from "process";

const redisTracking = {
    provide: 'tracking',
    useFactory: () => new Redis(process.env.REDIS_TRACKING),
};
@Module({
    providers: [redisTracking],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: process.env.REDIS_TRACKING,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule,redisTracking],
})
export class trackingRedis {}
