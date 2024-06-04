import {Controller, Get, Param, Request} from '@nestjs/common';
import {TrackingService} from './tracking.service';
import {ActionName} from "./interfaces/tracking.interface";
import {BullmqService} from "../../bullmq/bullmq.service";
import {BullmqFactory} from "../../bullmq/bullmq.factory";
import {batchRedisService} from "../batchRedis/batchRedis.service";

@Controller('tracking')
export class TrackingController {
    private readonly bufferSize: number = 5;
    private BullMqUserService: BullmqService;
    private BullMqPlatformService: BullmqService;
    private BullMqbatchService: BullmqService;
    private BullMqAdService: BullmqService;

    constructor(private readonly statsService: TrackingService,private readonly batchService: batchRedisService, private readonly bullmqFactory: BullmqFactory) {
        this.BullMqUserService = this.bullmqFactory.create('getUserData')
        this.BullMqAdService = this.bullmqFactory.create('getAdData')
        this.BullMqPlatformService = this.bullmqFactory.create('getPlatformData')
        this.BullMqbatchService = this.bullmqFactory.create('addData')
    }
    @Get('numbers')
    async getAllAdsData() {
        return await this.statsService.getDataFromRedis();
    }
    @Get('numbers/user/:userid')
    async getUserStatsData(@Param('userid') userid: string) {

        return (await this.BullMqUserService.addJobWithResponse({userid: userid}))

    }
    @Get('numbers/platform/:platform')
    async getStatsData(@Param('platform') platform: string) {
        return (await this.BullMqPlatformService.addJobWithResponse({platform: platform}))
    }

    @Get('numbers/ad/:ad')
    async getStatsDataForAd(@Param('ad') ad: string) {
        return (await this.BullMqAdService.addJobWithResponse({ad: ad}))
    }
    @Get(':adid/:userid/:action')
    async addStat(
        @Request() req: Request,
        @Param('adid') adid: string,
        @Param('userid') userid: string,
        @Param('action') action: ActionName
    ) {
        let time = 'undefined';

        switch (action) {
            case 'start':
                time = '0';
                break;
            case 'firstQuartile':
                time = String(Math.round(15 / 4));
                break;
            case 'midpoint':
                time = String(Math.round(15 / 2));
                break;
            case 'thirdQuartile':
                time = String(Math.round((15 / 4) * 3));
                break;
            case 'complete':
                time = '15';
                break;
        }

        setImmediate(async () => {
            await this.batchService.incrStat({
                ad: adid,
                action: action,
                userid: userid,
                platform: req.headers['host'],
                timestamp: Date.now(),
                time: String(time)
            });
            const buffer = await this.batchService.getData();
            if (buffer.length >= this.bufferSize) {
                await this.batchService.flushDB();
                await this.BullMqbatchService.addJob(buffer);
            }
        });

        return 'Success Added';
    }
}