
import { Module } from '@nestjs/common';
import {adMongoProviders} from "./providers/adMongo.providers";

@Module({
    providers: [...adMongoProviders],
    exports: [...adMongoProviders],
})
export class adMongoModule {}
