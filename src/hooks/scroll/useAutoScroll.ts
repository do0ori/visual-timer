import { useEffect, useRef } from 'react';

export const useAutoScroll = <T extends HTMLElement>(trigger: boolean, options?: ScrollIntoViewOptions) => {
    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        if (trigger && elementRef.current) {
            elementRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options,
            });
        }
    }, [trigger, options]);

    return elementRef;
};
