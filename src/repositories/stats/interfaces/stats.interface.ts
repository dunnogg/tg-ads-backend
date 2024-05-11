export type StatName = 'open' | 'close' | 'mute' | 'unmute' | 'impression' | 'view' | 'Watched to the end' | 'show';


export interface Stat {
    timestamp: number;
    action: StatName;
    time: string;
    userdata: string;
    userid: string
    ad: string;
    platform: string;
}