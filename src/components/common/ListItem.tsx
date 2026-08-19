import React from 'react';

type ListItemProps = {
  icon: React.ReactNode;
  content: React.ReactNode;
  onClick?: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, content, onClick }) => {
  return (
    <div className="flex items-start w-full min-w-0 gap-4" onClick={onClick}>
      {/* Icon Section */}
      <div className="shrink-0 mt-0.5">{icon}</div>
      {/* Content */}
      <div className="flex-1 min-w-0 w-full">{content}</div>
    </div>
  );
};

export default ListItem;
