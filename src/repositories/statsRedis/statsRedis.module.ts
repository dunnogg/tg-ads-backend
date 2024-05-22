import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import * as process from "process";


@Module({
    providers: [],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: process.env.REDIS_STATS,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule],
})
export class statsRedis {}
