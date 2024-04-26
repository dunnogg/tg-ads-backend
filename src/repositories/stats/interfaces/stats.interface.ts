export type StatName = 'open' | 'close' | 'mute' | 'unmute' | 'impression 10 sec' | 'view' | 'Watched to the end';


export interface Stat {
    stat_name: StatName;
    time: number;
    userdata: object;
    ad: string;
    platform: string;
    date: string;
}