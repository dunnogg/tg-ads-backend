import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ad } from './schemas/ad.schema';

@Injectable()
export class RtbService {
    constructor(@InjectModel(Ad.name) private catModel: Model<Ad>) {}



    async findAll(adtype: string, platform: string): Promise<Ad[]> {
        return this.catModel.find({ adtype: adtype, active: true, 'target.specificChannels': { $in: [platform] } }).exec();
    }

}
