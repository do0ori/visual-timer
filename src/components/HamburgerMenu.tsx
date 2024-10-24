import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSettingsSharp, IoAlbums } from 'react-icons/io5';
import { GoHomeFill } from 'react-icons/go';
import { IoMenu } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';

const HamburgerMenu: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
                className={`fixed left-5 top-6 z-50 transition-opacity duration-300 ${
                    isRunning ? 'invisible' : 'visible'
                } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            >
                <IoMenu size={35} />
            </button>

            <div
                ref={menuRef}
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } z-40`}
            >
                <div className="p-5 text-black">
                    <h2 className="mb-10 text-2xl font-bold">Menu</h2>
                    <ul className="space-y-5">
                        <li>
                            <Link to="/" onClick={toggleMenu} className="flex items-center space-x-2">
                                <GoHomeFill size={24} />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={toggleMenu} className="flex items-center space-x-2">
                                <IoAlbums size={24} />
                                <span>Coming Soon</span>
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
