import {Controller, Get, Param, Post, Headers} from '@nestjs/common';
import {TrackingService} from './tracking.service';
import {ActionName} from "./interfaces/tracking.interface";

@Controller('tracking')
export class TrackingController {
    constructor(private readonly statsService: TrackingService) {}
    @Get('numbers')
    async getStatsData() {
        return await this.statsService.getDataFromRedis();
    }
    @Post(':adid/:userid/:action/:time')
    addStat(@Param('adid') adid: string, @Param('userid') userid: string, @Param('action') action: ActionName, @Param('time') time: string ){
        return this.statsService.recordStat(adid, userid, action, time, origin)
    }
}