import React from 'react';
import { IoHelpCircle } from 'react-icons/io5';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { useThemeStore } from '../../store/themeStore';

type TooltipModalProps = {
    title?: string;
    desc: SweetAlertOptions['html'];
    className?: string;
};

const TooltipModal: React.FC<TooltipModalProps> = ({ title, desc, className }) => {
    const { selectedTheme } = useThemeStore();
    const showModal = () => {
        Swal.fire({
            title,
            html: desc,
            icon: 'info',
            iconColor: selectedTheme.color.point,
            width: '95%',
            confirmButtonColor: selectedTheme.color.point,
            confirmButtonText: 'Got it!',
            customClass: {
                popup: 'rounded-2xl p-6',
            },
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
