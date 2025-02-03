import { useEffect, useState } from 'react';

export function useAspectRatio() {
    const getVisualViewport = () => {
        return window.visualViewport
            ? window.visualViewport.width / window.visualViewport.height
            : window.innerWidth / window.innerHeight;
    };

    const [aspectRatio, setAspectRatio] = useState(getVisualViewport());

    useEffect(() => {
        const handleViewportChange = () => {
            requestAnimationFrame(() => {
                setAspectRatio(getVisualViewport());
            });
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
        } else {
            window.addEventListener('resize', handleViewportChange);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportChange);
            } else {
                window.removeEventListener('resize', handleViewportChange);
            }
        };
    }, []);

    return aspectRatio;
}
