import BeepBeep from '../../assets/beep-beep.mp3';
import ChimeTime from '../../assets/chime-time.mp3';
import Radar from '../../assets/radar.mp3';

type Alarm = {
    label: string;
    value: string;
};

export const alarmOptions: Alarm[] = [
    { label: 'Radar', value: Radar },
    { label: 'Chime Time', value: ChimeTime },
    { label: 'Beep Beep', value: BeepBeep },
];
