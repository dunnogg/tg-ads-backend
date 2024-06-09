import {Inject, Injectable} from '@nestjs/common';
import {Cat} from "./interfaces/cat.interface";
import { Model } from 'mongoose';

@Injectable()
export class RtbService {
    constructor(
        @Inject('CAT_MODEL')
        private catModel: Model<Cat>,
    ) {}

    async findAll(): Promise<Cat[]> {
        return this.catModel.find();
    }
}