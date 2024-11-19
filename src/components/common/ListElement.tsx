import React from 'react';

type ListElementProps = {
    icon: React.ReactNode;
    content: React.ReactNode;
    onClick?: () => void;
};

const ListElement: React.FC<ListElementProps> = ({ icon, content, onClick }) => {
    return (
        <div className="flex items-center justify-between gap-2" onClick={onClick}>
            <div className="flex grow gap-5">
                {/* Icon Section */}
                <div className="flex-shrink-0">{icon}</div>
                {/* Content */}
                {content}
            </div>
        </div>
    );
};

export default ListElement;
