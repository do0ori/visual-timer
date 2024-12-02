const VerticalLayout: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className }) => {
    return <div className={`flex h-full flex-col ${className || ''}`}>{children}</div>;
};

export default VerticalLayout;
