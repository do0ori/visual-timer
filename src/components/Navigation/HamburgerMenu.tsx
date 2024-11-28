import { useState, useRef, useEffect } from 'react';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { Link } from 'react-router-dom';
import { IoSettingsSharp, IoAlbums } from 'react-icons/io5';
import { IoMenu } from 'react-icons/io5';
import { MdRepeatOn, MdEmail } from 'react-icons/md';
import { RxLapTimer } from 'react-icons/rx';

// TODO: 선택된 메뉴 시각적 표시
const HamburgerMenu: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
    const aspectRatio = useAspectRatio();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const widthClass =
        aspectRatio >= 1.6
            ? 'w-64' // 데스크톱
            : aspectRatio >= 1.3
              ? 'w-1/2' // 태블릿
              : 'w-3/4'; // 모바일

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <button
                onClick={toggleMenu}
                disabled={isOpen}
                className={`z-50 transition-opacity duration-300 ${
                    isRunning ? 'invisible' : 'visible'
                } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            >
                <IoMenu size={35} />
            </button>

            <div
                ref={menuRef}
                className={`fixed left-0 top-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${widthClass}`}
            >
                <div className="p-5 text-black">
                    <h2 className="mb-10 text-2xl font-bold">Menu</h2>
                    <ul className="space-y-5">
                        <li>
                            <Link to="/" onClick={toggleMenu} className="flex items-center space-x-2">
                                <RxLapTimer size={24} className="-scale-x-100" />
                                <span>Basic Timer</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={toggleMenu} className="flex items-center space-x-2">
                                <MdRepeatOn size={24} />
                                <span className="line-through">Routine Timer</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={toggleMenu} className="flex items-center space-x-2">
                                <IoAlbums size={24} />
                                <span className="line-through">Parallel Timer</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" onClick={toggleMenu} className="flex items-center space-x-2">
                                <IoSettingsSharp size={24} />
                                <span>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <a href="mailto:fuzzydo0ori@gmail.com" className="flex items-center space-x-2">
                                <MdEmail size={24} />
                                <span>Contact</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu;
