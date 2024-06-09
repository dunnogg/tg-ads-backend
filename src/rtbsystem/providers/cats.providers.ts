import { Connection } from 'mongoose';
import {AdSchema} from "../schemas/ad.schema";

export const catsProviders = [
    {
        provide: 'CAT_MODEL',
        useFactory: (connection: Connection) => connection.model('Cat', AdSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];