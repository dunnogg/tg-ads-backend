export enum ActionName {
    Start = 'start',
    FirstQuartile = 'firstQuartile',
    Midpoint = 'midpoint',
    ThirdQuartile = 'thirdQuartile',
    Complete = 'complete',
    Mute = 'mute',
    Unmute = 'unmute',
    Pause = 'pause',
    Resume = 'resume',
    Rewind = 'rewind',
    Fullscreen = 'fullscreen',
    ExitFullscreen = 'exitFullscreen',
    Skip = 'skip',
    Expand = 'expand',
    Collapse = 'collapse',
    AcceptInvitation = 'acceptInvitation',
    Close = 'close'
}


export interface Track {
    timestamp: number;
    action: ActionName
    time?: string;
    userid: string
    ad: string;
    platform: string;
}