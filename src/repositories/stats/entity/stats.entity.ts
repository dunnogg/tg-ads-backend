import { DataType, Model, Prop, Schema } from '@oneralon/nestjs-clickhouse';
import { StatName } from '../interfaces/stats.interface';

@Schema({
    tableName: 'stats',
    options: 'ENGINE = MergeTree ORDER BY id',
    autoCreate: true,
})
export class Stats {
    @Prop({
        type: DataType.UInt64,
    })
    public id: number;

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
    public date: string;

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