import React from 'react';
import { IoHelpCircle } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { useTheme } from '../../hooks/useTheme';

const TooltipModal: React.FC<{ title?: string; desc: string; className?: string }> = ({ title, desc, className }) => {
    const { originalTheme } = useTheme();
    const showModal = () => {
        Swal.fire({
            title,
            text: desc,
            icon: 'info',
            iconColor: originalTheme.color.point,
            width: '95%',
            confirmButtonColor: originalTheme.color.point,
            confirmButtonText: 'Got it!',
        });
    };

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                showModal();
            }}
            className="flex size-5 items-center justify-center"
        >
            <IoHelpCircle size={20} className={`text-gray-400 ${className || ''}`} />
        </button>
    );
};

export default TooltipModal;
