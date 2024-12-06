import { useEffect, useState } from 'react';

const useOverlay = (overlayKey: string, onClose?: () => void) => {
    const [isOpen, setIsOpen] = useState(window.location.hash.includes(overlayKey));

    const close = () => {
        if (isOpen) {
            window.history.back();
            if (onClose) onClose();
        }
    };

    useEffect(() => {
        const handleHashChange = () => {
            const currentlyOpen = window.location.hash.includes(overlayKey);
            setIsOpen(currentlyOpen);

            if (!currentlyOpen && onClose) {
                onClose();
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [overlayKey, onClose]);

    useEffect(() => {
        // Handle escape key to close the overlay
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, close]);

    return { isOpen, close };
};

export default useOverlay;
