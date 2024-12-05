import { useEffect } from 'react';

const useOverlayClose = (isOpen: boolean, onClose: () => void) => {
    useEffect(() => {
        // Handle escape key to close the overlay
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
};

export default useOverlayClose;
