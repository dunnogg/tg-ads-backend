import { IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
export class CreativeDto {
    @IsNotEmpty()
    @ApiProperty({
        required: true,
    })
    id: string;

    @IsNotEmpty()
    @ApiProperty({
        required: true,
    })
    xmlData: string

}