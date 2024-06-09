import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RtbService } from './rtb.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Ad } from './schemas/ad.schema';

@Controller('rtb')
export class RtbController {
    constructor(private readonly rtbService: RtbService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto): Promise<Ad> {
        return this.rtbService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Ad[]> {
        return this.rtbService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Ad> {
        return this.rtbService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto): Promise<Ad> {
        return this.rtbService.update(id, updateCatDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Ad> {
        return this.rtbService.delete(id);
    }
}
