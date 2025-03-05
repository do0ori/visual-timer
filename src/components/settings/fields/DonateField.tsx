import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { IoHeart } from 'react-icons/io5';
import { MdExpandMore } from 'react-icons/md';
import { useAutoScroll } from '../../../hooks/useAutoScroll';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';

const DonateField: React.FC = () => {
    const { selectedTheme } = useThemeStore();
    const heartIcon = <IoHeart size={24} className="size-full" />;

    const donateContent = (
        <Disclosure>
            {({ open }) => {
                const panelRef = useAutoScroll<HTMLDivElement>(open);

                return (
                    <div className="flex w-full flex-col gap-2">
                        <DisclosureButton className="flex w-full items-center justify-between rounded-lg text-lg transition">
                            <span>Support Visual Timer</span>
                            <MdExpandMore
                                className={`${open ? 'rotate-180' : ''} size-5 transition-transform duration-200`}
                            />
                        </DisclosureButton>

                        <DisclosurePanel ref={panelRef} className="flex flex-col gap-2">
                            <p className="text-gray-500">
                                Visual Timer is completely free to use without any functional restrictions or ads. If
                                you like this app, consider supporting the app to help keep it free and improve its
                                features.
                            </p>
                            <a
                                href="https://www.paypal.com/paypalme/do0ori"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border px-4 py-2 text-center transition hover:bg-black/5"
                                style={{
                                    borderColor: selectedTheme.color.point,
                                }}
                            >
                                Buy Me a Coffee
                            </a>
                        </DisclosurePanel>
                    </div>
                );
            }}
        </Disclosure>
    );

    return <ListItem icon={heartIcon} content={donateContent} />;
};

export default DonateField;
