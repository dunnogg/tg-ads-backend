import { StatName } from '../interfaces/stats.interface';
import { IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
export class CreateStatDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'view',
        required: true,
        description: 'Type of action'
    })
    action: StatName;

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
    time: string;

    @ApiProperty({
        example: '{ chatid: 312313, name: dunno}',
        required: false,
        description: 'User data'
    })
    userdata: string;
    @ApiProperty({
        example: '321321321321321',
        required: false,
        description: 'Date the event was recorded'
    })
    timestamp: number;
}