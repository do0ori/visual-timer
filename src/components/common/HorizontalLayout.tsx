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

export default HorizontalLayout;
