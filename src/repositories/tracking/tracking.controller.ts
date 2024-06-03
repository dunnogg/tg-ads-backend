import {Controller, Get, Param, Request} from '@nestjs/common';
import {TrackingService} from './tracking.service';
import {ActionName} from "./interfaces/tracking.interface";
import {BullmqService} from "../../bullmq/bullmq.service";
import {BullmqFactory} from "../../bullmq/bullmq.factory";

@Controller('tracking')
export class TrackingController {
    private buffer: any[] = [];
    private readonly bufferSize: number = 10;
    private BullMqUserService: BullmqService;
    private BullMqPlatformService: BullmqService;
    private BullMqbatchService: BullmqService;
    private BullMqAdService: BullmqService;

    constructor(private readonly statsService: TrackingService, private readonly bullmqFactory: BullmqFactory) {
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
    async addStat(@Request() req: Request, @Param('adid') adid: string, @Param('userid') userid: string, @Param('action') action: ActionName) {
        /*return this.statsService.recordStat(adid, userid, action, req.headers['host'])*/
        let time = undefined
        if (action === 'start') {
            time = 0
        }
        if (action === 'firstQuartile') {
            time = Math.round(15 / 4)
        }
        if (action === 'midpoint') {
            time = Math.round(15 / 2)
        }
        if (action === 'thirdQuartile') {
            time = Math.round(((15 / 4) * 3))
        }
        if (action === 'complete') {
            time = 15
        }
        this.buffer.push({
            timestamp: Date.now(),
            ad: adid,
            platform: req.headers['host'],
            time: String(time),
            action: action,
            userid: String(userid),
        });
        if (this.buffer.length >= this.bufferSize) {
            const bufferCopy = [...this.buffer];
            this.buffer = [];
            await this.BullMqbatchService.addJob(bufferCopy);
        }
        return 'Success Added'
    }
}