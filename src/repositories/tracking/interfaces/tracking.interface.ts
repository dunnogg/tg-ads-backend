export enum ActionName {
    Start = 'start',
    FirstQuartile = 'firstQuartile',
    Midpoint = 'midpoint',
    ThirdQuartile = 'thirdQuartile',
    Complete = 'complete',
    Pause = 'pause',
    Resume = 'resume',
    Rewind = 'rewind',
    Skip = 'skip',
    Mute = 'mute',
    Unmute = 'unmute',
    Fullscreen = 'fullscreen',
    ExitFullscreen = 'exitFullscreen',
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