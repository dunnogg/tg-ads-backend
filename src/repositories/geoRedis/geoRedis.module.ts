import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from 'dotenv'
import Redis from "ioredis";

config()

const redisProvider2 = {
    provide: 'geo',
    useFactory: () => new Redis('redis://default:QUh0WFWRCJjMJLlFNo7tE2L35Yz5a6gA@redis-17519.c55.eu-central-1-1.ec2.redns.redis-cloud.com:17519'),
};

@Module({
    providers: [redisProvider2],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: `redis://default:QUh0WFWRCJjMJLlFNo7tE2L35Yz5a6gA@redis-17519.c55.eu-central-1-1.ec2.redns.redis-cloud.com:17519`,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule, redisProvider2],
})
export class geoRedis {}
