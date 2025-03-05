import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../store/types/theme';
import TopBar from '../common/TopBar';
import ThemeForm from './forms/ThemeForm';

type ThemeOverlayProps = {
    initialTheme: Theme | null;
    mode: 'add' | 'edit';
    onClose: () => void;
};

const ThemeOverlay: React.FC<ThemeOverlayProps> = ({ initialTheme, mode, onClose }) => {
    const { selectedThemeCopy } = useTheme();
    const { isOpen, close } = useOverlay('theme');

    const handleClose = () => {
        close();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex size-full flex-col"
            style={{ backgroundColor: selectedThemeCopy.color.main }}
        >
            <TopBar.Cancel onLeftClick={handleClose} center={`${mode === 'add' ? 'Add' : 'Edit'} Custom Theme`} />
            <ThemeForm initialData={initialTheme} mode={mode} close={handleClose} />
        </div>
    );
};

export default ThemeOverlay;
