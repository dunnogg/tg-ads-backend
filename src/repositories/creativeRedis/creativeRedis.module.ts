import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from 'dotenv'
import Redis from "ioredis";

config()

const redisProvider2 = {
    provide: 'creative',
    useFactory: () => new Redis('redis://default:Zl2L9mjZavdR6yPpqGh3v6qlI0KDwDLQ@redis-10699.c300.eu-central-1-1.ec2.redns.redis-cloud.com:10699'),
};

@Module({
    providers: [redisProvider2],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: `redis://default:Zl2L9mjZavdR6yPpqGh3v6qlI0KDwDLQ@redis-10699.c300.eu-central-1-1.ec2.redns.redis-cloud.com:10699`,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule, redisProvider2],
})
export class creoRedis {}
