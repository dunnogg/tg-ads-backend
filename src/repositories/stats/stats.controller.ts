import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import {CreateStatDto} from './dto/create-stat.dto';
import {StatName} from "./interfaces/stats.interface";

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}


    @Get('ad/:id')
    getAdStats(@Param('id') id: string) {
        return this.statsService.getStatsByAdId(id);
    }

    @Get('ad/:id/:userid/:action')
    getStatByUserIdAndAdId(@Param('id') id: string, @Param('userid') userid: string, @Param('action') action: string) {
        console.log('Data >>>',userid, id, action)
        return this.statsService.getStatByUserIdAndAdId(userid, id, action);
    }
    @Get('platform/:url')
    getPlatformStats(@Param('url') url: string) {
        return this.statsService.getStatsByPlatform(url);
    }

    @Get('platform/:url/:statname')
    getPlatformStat(@Param('url') url: string, @Param('statname') statname: StatName) {
        return this.statsService.getStatByPlatform(url, statname);
    }

    @Get('ad/:id/:statname')
    getAdStat(@Param('id') id: string, @Param('statname') statname: StatName) {
        return this.statsService.getStatByAdId(id, statname);
    }
    @Post()
    recordStat(@Body() statDto: CreateStatDto) {
        return this.statsService.recordStat(statDto);
    }
    @Get()
    getAllAdsStats() {
        return this.statsService.getAllAdsStats();
    }
}