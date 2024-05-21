import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from 'dotenv'
import Redis from "ioredis";

config()

const redisGeo = {
    provide: 'geo',
    useFactory: () => new Redis('redis://default:QUh0WFWRCJjMJLlFNo7tE2L35Yz5a6gA@redis-17519.c55.eu-central-1-1.ec2.redns.redis-cloud.com:17519'),
};

@Module({
    providers: [redisGeo],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: `redis://default:QUh0WFWRCJjMJLlFNo7tE2L35Yz5a6gA@redis-17519.c55.eu-central-1-1.ec2.redns.redis-cloud.com:17519`,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule, redisGeo],
})
export class geoRedis {}
