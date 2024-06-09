import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ad } from './schemas/ad.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class RtbService {
    constructor(@InjectModel(Ad.name) private catModel: Model<Ad>) {}

    async create(createCatDto: CreateCatDto): Promise<Ad> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async findAll(): Promise<Ad[]> {
        return this.catModel.find().exec();
    }

    async findOne(id: string): Promise<Ad> {
        return this.catModel.findById(id).exec();
    }

    async update(id: string, updateCatDto: CreateCatDto): Promise<Ad> {
        return this.catModel.findByIdAndUpdate(id, updateCatDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Ad> {
        return this.catModel.findByIdAndDelete(id).exec();
    }
}
