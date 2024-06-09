import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class RtbService {
    constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async findAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }

    async findOne(id: string): Promise<Cat> {
        return this.catModel.findById(id).exec();
    }

    async update(id: string, updateCatDto: CreateCatDto): Promise<Cat> {
        return this.catModel.findByIdAndUpdate(id, updateCatDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Cat> {
        return this.catModel.findByIdAndDelete(id).exec();
    }
}
