import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ad extends Document {
    token: string
    __v: number
    _id: string
    ads: string[]
    active: boolean
    title: string
    text: string
    link: string
    cpm: string
    initialBudget: string
    adtype: string
    videoLink: string
    iconLink: string
    depth: number
    target: {
        languages: Array<string>
        topics: Array<string>
        specificChannels: Array<string>
        geo: Array<string>
    }
    exclude: {
        topics: Array<string>
        specificChannels: Array<string>
    }
    profileId: string
    limit: {
        viewLimit: number
        impressionLimit: number
        clickLimit: number
        closeLimit: number
        viewsPerUserLimit: number
    }
    impressionData: {
        availableImpressions: Array<number>
        choosedImpression: number
    }
}

export const AdSchema = SchemaFactory.createForClass(Ad);
