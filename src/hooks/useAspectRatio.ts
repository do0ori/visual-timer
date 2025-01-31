import { useEffect, useState } from 'react';

export function useAspectRatio() {
    const getAspectRatio = () => {
        return window.innerWidth / window.innerHeight;
    };

    const [aspectRatio, setAspectRatio] = useState(getAspectRatio());

    useEffect(() => {
        const handleResize = () => {
            // Give delay to get the correct value on iOS
            setTimeout(() => {
                setAspectRatio(getAspectRatio());
            }, 10);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return aspectRatio;
}
