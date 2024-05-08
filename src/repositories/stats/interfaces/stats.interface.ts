export type StatName = 'open' | 'close' | 'mute' | 'unmute' | 'impression 10 sec' | 'view' | 'Watched to the end';


export interface Stat {
    timestamp: number;
    action: StatName;
    time: string;
    userdata: string;
    userid: string
    ad: string;
    platform: string;
}