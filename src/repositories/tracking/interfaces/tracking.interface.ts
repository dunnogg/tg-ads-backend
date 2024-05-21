export type ActionName = 'start' | 'firstQuartile' | 'midpoint' | 'thirdQuartile' | 'complete' | 'pause' | 'resume' | 'rewind' | 'skip' | 'mute' | 'unmute' | 'fullscreen' | 'exitFullscreen' | 'expand' | 'collapse' | 'acceptInvitation' | 'close ';


export interface Track {
    timestamp: number;
    action: ActionName
    time?: string;
    userid: string
    ad: string;
    platform: string;
}