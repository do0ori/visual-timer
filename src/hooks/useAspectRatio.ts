import { useState, useEffect } from 'react';

export function useAspectRatio() {
    const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setAspectRatio(window.innerWidth / window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return aspectRatio;
}
