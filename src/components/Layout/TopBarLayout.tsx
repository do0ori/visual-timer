import TopBar from '../TopBar';

const TopBarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <TopBar title="Settings" />
            <div className="p-5 pt-16">{children}</div>
        </div>
    );
};

export default TopBarLayout;
