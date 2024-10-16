import React from 'react';
import { Theme } from '../../config/timer/themes';

type QuoteDisplayProps = {
    currentTheme: Theme;
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ currentTheme }) => (
    <div className="absolute bottom-24 left-0 w-full text-center">
        <p
            className="text-sm font-bold"
            style={{
                color: currentTheme.color.point,
            }}
        >
            {currentTheme.quote.split('\n').map((line, index) => (
                <span key={index} className={'select-none'}>
                    {line}
                    <br />
                </span>
            ))}
        </p>
    </div>
);

export default QuoteDisplay;
