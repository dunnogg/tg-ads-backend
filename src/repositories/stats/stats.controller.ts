import {Body, Controller, Get, Param, Post, Response} from '@nestjs/common';
import {StatsService} from './stats.service';
import {CreateStatDto} from './dto/create-stat.dto';
import {StatName} from "./interfaces/stats.interface";
import {CreativeDto} from "../creativeRedis/dto/creative.dto";

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}


    @Get('ad/:id')
    getAdStats(@Param('id') id: string) {
        return this.statsService.getStatsByAdId(id);
    }

    @Get('ad/:userid/:action')
    getStatByUserIdAndAdId(@Param('userid') userid: string, @Param('action') action: string) {
        return this.statsService.getStatByUserId(userid, action);
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

    @Get('numbers')
    async getStatsData() {
        return await this.statsService.getDataFromRedis();
    }

    @Get()
    getAllAdsStats() {
        return this.statsService.getDataFromRedis();
    }
    @Get('geo/:id/:ip')
    getIpData(@Param('id') id: string, @Param('ip') ip: string){
        return this.statsService.getIpData(ip, id)
    }
    @Get('creative/:id')
    async getCreative(@Param('id') id: string, @Response() res){
        const creative = await this.statsService.getCreative(id)
        res.set('Content-Type', 'text/xml');
        res.send(creative);
    }
    @Post('creative')
    addCreative(@Body() creativeDto: CreativeDto){
        return this.statsService.addCreative(creativeDto.id, creativeDto.xmlData)
    }
}