import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { CiGlobe } from 'react-icons/ci';

interface TranslatorProps {
    isTransparent?: boolean;
}

const Translator = ({ isTransparent = false }: TranslatorProps) => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'cnh', name: '中文' },
        { code: 'id', name: 'Bahasa' },
        { code: 'vi', name: 'Tiếng Việt' },
        { code: 'jp', name: '日本語' }
    ];

    return (
        <Menu as="div" className="relative">
            <MenuButton
                className={`inline-flex items-center gap-1 rounded-md py-1.5 px-3 text-sm font-medium focus:outline-none transition-colors
                    ${isTransparent
                        ? 'bg-white/90 text-black shadow-md hover:bg-white/90'
                        : 'bg-white/95 text-navbarButtonTextColor shadow-inner shadow-white/10 hover:bg-opacity-80'}
                `}
            >
                {i18n.language === 'en' && 'EN'}
                {i18n.language === 'cnh' && '中文'}
                {i18n.language === 'id' && 'ID'}
                {i18n.language === 'vi' && 'VN'}
                {i18n.language === 'jp' && 'JA'}
                <CiGlobe className={`size-4 ${isTransparent ? 'fill-black' : 'fill-gray-600'}`} />
            </MenuButton>

            <MenuItems
                transition
                style={{ zIndex: "60" }}
                anchor="bottom end"
                className="w-40 absolute right-0 mt-2 origin-top-right rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-lg focus:outline-none"
            >
                {languages.map((lang) => (
                    <MenuItem key={lang.code}>
                        <button
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className="group flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 text-gray-700 text-left"
                        >
                            {lang.name}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
};

export default Translator;