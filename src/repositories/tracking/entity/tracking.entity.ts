import {ActionName} from '../interfaces/tracking.interface';
import {DataType, Model, Prop, Schema} from "@oneralon/nestjs-clickhouse";

@Schema({
    tableName: 'Tracking',
    options: 'ENGINE = MergeTree ORDER BY timestamp',
    autoCreate: true,
})
export class Tracking {
    @Prop({
        type: DataType.UInt64,
    })
    public timestamp: number;

    @Prop({
        type: DataType.String,
    })
    public action: ActionName;

    @Prop({
        type: DataType.String,
    })
    public platform: string;

    @Prop({
        type: DataType.String,
    })
    public ad: string;

    @Prop({
        type: DataType.String,
    })
    public userid?: string;

    @Prop({
        type: DataType.String,
    })
    public time?: string;

}

export type TrackModel = Model<Tracking>;