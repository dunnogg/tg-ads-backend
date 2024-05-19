import { IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
export class IpInfoDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'Canada',
        required: true,
        description: 'Country name'
    })
    country: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'CA',
        required: true,
        description: 'Country code'
    })
    countryCode: string

    @ApiProperty({
        example: 'OC',
        required: true,
        description: 'Region code of country'
    })
    region: string;

    @ApiProperty({
        example: 'Quebec',
        required: true,
        description: 'Region name of country'
    })
    regionName: string;
    @ApiProperty({
        example: 'Montreal',
        required: true,
        description: 'City of country'
    })
    city: number;
    @ApiProperty({
        example: 'H1S',
        required: true,
        description: 'User`s zip code'
    })
    zip: string;
    @ApiProperty({
        example: 45.5909,
        required: true,
        description: 'User latitude coordinates'
    })
    lat: string;
    @ApiProperty({
        example: -73.5655,
        required: true,
        description: 'User coordinates by longitude'
    })
    lon: string;
    @ApiProperty({
        example: "America/Toronto",
        required: true,
        description: 'User timezone'
    })
    timezone: string;
    @ApiProperty({
        example: false,
        required: true,
        description: 'Mobile (cellular) connection'
    })
    mobile: boolean;
    @ApiProperty({
        example: false,
        required: true,
        description: 'Proxy, VPN or Tor exit address'
    })
    proxy: boolean;
    @ApiProperty({
        example: false,
        required: true,
        description: 'Hosting, colocated or data center'
    })
    hosting: boolean;
    @ApiProperty({
        example: '24.48.0.1',
        required: true,
        description: 'IP used for the query'
    })
    query: string;
}