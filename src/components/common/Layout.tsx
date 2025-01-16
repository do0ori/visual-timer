const HorizontalLayout: React.FC<{
    className?: string;
    leftChildren: React.ReactNode;
    rightChildren: React.ReactNode;
}> = ({ leftChildren, rightChildren, className }) => {
    return (
        <div className={`flex h-full ${className || ''}`}>
            <div className="relative w-1/2">{leftChildren}</div>
            <div className="relative w-1/2">{rightChildren}</div>
        </div>
    );
};

const VerticalLayout: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => {
    return <div className={`flex h-full flex-col ${className || ''}`}>{children}</div>;
};

const Layout = {
    Horizontal: HorizontalLayout,
    Vertical: VerticalLayout,
};

export default Layout;
