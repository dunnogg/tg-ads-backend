import { StatName } from '../interfaces/stats.interface';
import { IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
export class CreateStatDto {

    @ApiProperty({
        example: 'view',
        required: true,
        description: 'Type of action'
    })
    stat_name: StatName;

    @IsNotEmpty()
    @ApiProperty({
        example: 'web.telegram.org',
        required: true,
        description: 'platform url'
    })
    platform: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'xdasxdasdasdxada',
        required: true,
        description: 'ad id'
    })
    ad: string

    @ApiProperty({
        example: '10.21312321',
        required: true,
        description: 'time'
    })
    time: number;

    @ApiProperty({
        example: '{ chatid: 312313, name: dunno}',
        required: true,
        description: 'ad id'
    })
    userdata?: object;

    @ApiProperty({
        example: '1231231',
        required: true,
        description: 'Date in unix timestamp'
    })
    date: string;
}