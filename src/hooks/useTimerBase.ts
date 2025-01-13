import { useTimer } from './useTimer';

type UseTimerBaseProps = {
    id: string;
    initialTime: number;
    isMinutes: boolean;
    onFinish: (reset: () => void) => void;
    autoStart?: boolean;
};

export const useTimerBase = ({ id, initialTime, isMinutes, onFinish, autoStart }: UseTimerBaseProps) => {
    return useTimer({
        id,
        initialTime,
        unit: isMinutes ? 'minutes' : 'seconds',
        maxTime: 60,
        onFinish,
        autoStart,
    });
};
