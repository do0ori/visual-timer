type ListItemProps = {
    icon: React.ReactNode;
    content: React.ReactNode;
    onClick?: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, content, onClick }) => {
    return (
        <div className="flex items-center justify-between gap-2" onClick={onClick}>
            <div className="flex grow gap-5">
                {/* Icon Section */}
                <div className="shrink-0">{icon}</div>
                {/* Content */}
                {content}
            </div>
        </div>
    );
};

export default ListItem;
