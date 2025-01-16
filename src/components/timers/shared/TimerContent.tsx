import { useAspectRatio } from '../../../hooks/useAspectRatio';
import HorizontalLayout from '../../common/HorizontalLayout';
import VerticalLayout from '../../common/VerticalLayout';

export type TimerContentProps = {
    top: {
        leftChildren: React.ReactNode;
        rightChildren: React.ReactNode;
    };
    bottom: React.ReactNode;
    timerInfo: React.ReactNode;
    timer: React.ReactNode;
};

const TimerContent: React.FC<TimerContentProps> = ({ top, bottom, timerInfo, timer }) => {
    const content = {
        top: (
            <div className="mt-[5%] flex items-center justify-between px-[5%]">
                {top.leftChildren}
                {top.rightChildren}
            </div>
        ),
        bottom: <div className="mb-[5%] w-full self-center px-[5%]">{bottom}</div>,
        timerInfo: <div className="mt-[5%] flex flex-col items-center justify-center">{timerInfo}</div>,
        timer,
    };

    const aspectRatio = useAspectRatio();

    return aspectRatio > 1 ? (
        <HorizontalLayout
            className="h-screen w-screen"
            leftChildren={content.timer}
            rightChildren={
                <div className="flex size-full flex-col justify-between">
                    {content.top}
                    {content.timerInfo}
                    {content.bottom}
                </div>
            }
        />
    ) : (
        <VerticalLayout className="h-screen w-screen">
            <div className="flex size-full flex-col justify-between">
                {content.top}
                {content.timerInfo}
                <div className="flex grow items-center justify-center">{content.timer}</div>
                {content.bottom}
            </div>
        </VerticalLayout>
    );
};

export default TimerContent;
