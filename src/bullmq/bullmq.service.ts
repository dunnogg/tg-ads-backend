import {Inject, Injectable} from '@nestjs/common';
import {ConnectionOptions, Job, Queue, QueueEvents, Worker} from 'bullmq';
import {TrackingService} from '../repositories/tracking/tracking.service';
import * as process from 'process';
@Injectable()
export class BullmqService {
    private queue: Queue;
    private queueEvents: QueueEvents;
    private connection: ConnectionOptions;

    constructor(
        private readonly queueName: string,
        @Inject(TrackingService) private readonly trackingService: TrackingService
    ) {
        this.connection = {
            host: '192.168.32.1',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        };
        this.queue = new Queue(queueName, {
            connection: this.connection,
            defaultJobOptions: {
                removeOnComplete: true
            }
        });
        this.createWorker(queueName);
        this.queueEvents = new QueueEvents(queueName, { connection: this.connection });
    }

    async addJob(data: any): Promise<Job> {
        return await this.queue.add('myJob', data);
    }

    async addJobWithResponse(data: any): Promise<Job> {
        const job = await this.queue.add('myJob', data);
        return await job.waitUntilFinished(this.queueEvents);
    }

    private createWorker(queueName: string) {
        const worker = new Worker(queueName, async (job) => {
            try {
                if (queueName === 'getUserData') {
                    return await this.trackingService.getDataForUserFromRedis(job.data.userid);
                }
                if (queueName === 'getPlatformData') {
                    return await this.trackingService.getDataForPlatformFromRedis(job.data.platform);
                }
                if (queueName === 'getAdData') {
                    return await this.trackingService.getDataForAdFromRedis(job.data.ad);
                }
                if (queueName === 'addData') {
                    await this.processBatch(job.data);
                }
            } catch (e) {
                console.log('Error', e);
            }
        }, { connection: this.connection });

        worker.on('error', (error) => {
            console.log(`Error ${error.message}`);
        });

        worker.on('completed', (job) => {
            console.log(`Task ${job.id} completed`);
        });
    }

    async processBatch(JobData: any) {
        await this.trackingService.recordStat(JobData);
    }
}
