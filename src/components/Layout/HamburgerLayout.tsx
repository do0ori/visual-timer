import HamburgerMenu from '../HamburgerMenu';

const HamburgerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <HamburgerMenu />
            <div className="absolute top-0">{children}</div>
        </div>
    );
};

export default HamburgerLayout;
