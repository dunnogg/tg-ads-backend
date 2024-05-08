import { StatName } from '../interfaces/stats.interface';
import {DataType, Model, Prop, Schema} from "@oneralon/nestjs-clickhouse";

@Schema({
    tableName: 'stats',
    options: 'ENGINE = MergeTree ORDER BY timestamp',
    autoCreate: true,
})
export class Stats {
    @Prop({
        type: DataType.UInt64,
    })
    public timestamp: number;

    @Prop({
        type: DataType.String,
    })
    public action: StatName;

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
    public userdata?: string;

    @Prop({
        type: DataType.String,
    })
    public time?: string;

}

export type StatsModel = Model<Stats>;