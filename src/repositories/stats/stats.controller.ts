import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import {CreateStatDto} from './dto/create-stat.dto';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}


    @Get('ad/:id')
    getStat(@Param('id') id: string) {
        return this.statsService.getStatByAdId(id);
    }
    @Get('platform/:url')
    getPlatformStat(@Param('url') url: string) {
        return this.statsService.getStatByPlatform(url);
    }
    @Post()
    recordStat(@Body() statDto: CreateStatDto) {
        return this.statsService.recordStat(statDto);
    }
}