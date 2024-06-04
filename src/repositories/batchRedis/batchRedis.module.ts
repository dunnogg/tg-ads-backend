import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import Redis from "ioredis";
import * as process from "process";

const redisBatch = {
    provide: 'batch',
    useFactory: () => new Redis(process.env.REDIS_CHCACHE),
};
@Module({
    providers: [redisBatch],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: process.env.REDIS_CHCACHE,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule,redisBatch],
})
export class batchRedis {}
