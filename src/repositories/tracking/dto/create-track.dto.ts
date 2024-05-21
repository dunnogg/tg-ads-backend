import { IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {ActionName} from "../interfaces/tracking.interface";
export class CreateTrackDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'view',
        required: true,
        description: 'Type of action'
    })
    action: ActionName;

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
        required: false,
        description: 'time'
    })
    time: string;

    @ApiProperty({
        example: '321321321321321',
        required: false,
        description: 'Date the event was recorded'
    })
    timestamp: number;
    @ApiProperty({
        example: '69195553240',
        required: false,
        description: 'User id'
    })
    userid: string;
}