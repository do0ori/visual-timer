type Alarm = {
    label: string;
    value: string;
};

export const alarmOptions: Alarm[] = [
    { label: 'Radar', value: '/visual-timer/audios/radar.mp3' },
    { label: 'Chime Time', value: '/visual-timer/audios/chime-time.mp3' },
    { label: 'Beep Beep', value: '/visual-timer/audios/beep-beep.mp3' },
];
