import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import * as process from 'process';
import { config } from 'dotenv'

config()

@Module({
    providers: [
        {
            provide: 'REDIS_OPTIONS',
            useValue: {
                url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            },
        },
        {
            inject: ['REDIS_OPTIONS'],
            provide: 'REDIS_CLIENT',
            useFactory: async (options: { url: string }) => {
                const client = createClient(options);
                await client.connect();
                return client;
            },
        },
        RedisService
    ],
    exports: ['REDIS_CLIENT', RedisModule],
})
export class RedisModule {}
