import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import TopBar from '../common/TopBar';

const BasicTopBar: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();

    return <TopBar title={title} leftIcon={<IoArrowBack size={24} />} onLeftClick={() => navigate('/')} />;
};

export default BasicTopBar;
