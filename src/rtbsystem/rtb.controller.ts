import {Controller, Get, Param} from '@nestjs/common';
import { RtbService } from './rtb.service';
import { Ad } from './schemas/ad.schema';

@Controller('rtb')
export class RtbController {
    constructor(private readonly rtbService: RtbService) {}


    @Get(':adtype/:platform')
    async findAll(@Param('adtype') adtype: string, @Param('platform') platform: string): Promise<Ad[]> {
        return this.rtbService.findAll(adtype, platform);
    }
}
