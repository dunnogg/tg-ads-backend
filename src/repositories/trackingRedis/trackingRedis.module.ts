import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from 'dotenv'
import Redis from "ioredis";

config()
const redisTracking = {
    provide: 'tracking',
    useFactory: () => new Redis('redis://default:nJagDp5CKIyNVTp2bJYNU7cwPI66XkjB@redis-11174.c14.us-east-1-3.ec2.redns.redis-cloud.com:11174'),
};
@Module({
    providers: [redisTracking],
    imports: [RedisModule.forRootAsync({
        useFactory: ()=> ({
            type: 'single',
            url: `redis://default:nJagDp5CKIyNVTp2bJYNU7cwPI66XkjB@redis-11174.c14.us-east-1-3.ec2.redns.redis-cloud.com:11174`,
        })
        // url: `statsRedis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })],
    exports: [RedisModule,redisTracking],
})
export class trackingRedis {}
