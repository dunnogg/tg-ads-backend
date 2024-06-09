import {Controller, Get, Param, Request} from '@nestjs/common';
import {RtbService} from './rtb.service';

@Controller('rtb')
export class RtbController {

    constructor(private readonly rtbService: RtbService) {}
    @Get()
    async getAllCreatives() {
        return await this.rtbService.findAll()
    }
}