import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RtbService } from './rtb.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';

@Controller('cats')
export class RtbController {
    constructor(private readonly rtbService: RtbService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
        return this.rtbService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.rtbService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cat> {
        return this.rtbService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto): Promise<Cat> {
        return this.rtbService.update(id, updateCatDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Cat> {
        return this.rtbService.delete(id);
    }
}
