import { HiMiniHome } from 'react-icons/hi2';

const HomeButton = ({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) => (
    <button onClick={onClick} aria-label="Back to Default Timer" className={isVisible ? 'visible' : 'invisible'}>
        <HiMiniHome size={30} />
    </button>
);

export default HomeButton;
