
import * as mongoose from 'mongoose';

export const adMongoProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect('mongodb://localhost/nest'),
    },
];
