import React from 'react';
import { HiMiniHome } from 'react-icons/hi2';
import Button from '../../../common/Button';

type HomeButtonProps = {
  isVisible: boolean;
  onClick: () => void;
};

const HomeButton: React.FC<HomeButtonProps> = ({ isVisible, onClick }) => {
  if (!isVisible) {
    return <div className="size-16 invisible" aria-hidden="true" />;
  }

  return (
    <Button onClick={onClick} aria-label="Back to Default Timer" title="Back to Default Timer">
      <HiMiniHome size={30} />
    </Button>
  );
};

export default HomeButton;
