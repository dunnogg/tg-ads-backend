import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import * as process from 'process';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from 'dotenv'

config()

@Module({
    providers: [],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: `redis://default:H1uRp0x0kVyHBpZIs8l2Atx4Urg531yh@redis-11433.c257.us-east-1-3.ec2.redns.redis-cloud.com:11433`,
        })
        // url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule],
})
export class Redis {}
