import { useCallback, useEffect } from 'react';

type ScrollToSelectedOptions = {
    offset?: number;
    behavior?: ScrollBehavior;
};

/**
 * Automatically scrolls a selected item into view within a container.
 *
 * @param containerRef Ref of the container with overflow
 * @param selectedRef Ref of the selected item to scroll into view
 * @param trigger Trigger to activate scrolling
 * @param options Optional settings for scrolling behavior
 */
const useScrollToSelected = (
    containerRef: React.RefObject<HTMLElement>,
    selectedRef: React.RefObject<HTMLElement>,
    trigger: boolean,
    options?: ScrollToSelectedOptions
) => {
    const { offset = 0, behavior = 'smooth' } = options || {};

    const scrollToSelected = useCallback(() => {
        if (!containerRef.current || !selectedRef.current) return;

        const container = containerRef.current;
        const selected = selectedRef.current;

        const containerHeight = container.clientHeight;
        const itemHeight = selected.clientHeight;
        const scrollTo = selected.offsetTop - containerHeight / 2 + itemHeight / 2 + offset;

        container.scrollTo({
            top: Math.max(0, scrollTo),
            behavior,
        });
    }, [containerRef, selectedRef, offset, behavior]);

    useEffect(() => {
        if (trigger) {
            scrollToSelected();
        }
    }, [trigger, scrollToSelected]);
};

export default useScrollToSelected;
