import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RtbService } from './rtb.service';
import { RtbController } from './rtb.controller';
import { TrackingModule } from '../repositories/tracking/tracking.module';
import { geoRedis } from '../repositories/geoRedis/geoRedis.module';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://vercel-admin-user-65f20d6caf02bd40c3adbe44:a7vCMAUMbb7MbMmY@staging-tgads-cluster.e9u78kq.mongodb.net/staging-tgads-db?retryWrites=true&w=majority'), // Замените на ваш MongoDB connection string
        MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), // Регистрация схемы
        TrackingModule,
        geoRedis,
    ],
    controllers: [RtbController],
    providers: [RtbService],
    exports: [RtbService],
})
export class RtbModule {}
