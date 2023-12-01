import GenericModalContainer from '../UI/Modal/GenericModalContainer';
import ThemeSwitcher from '../UI/ThemeSwitch';
import { MobileMenuProps } from '@/types/component-props/mobile-menu.model';

const MobileMenu = ({ children, showModal, theme, setTheme, onClose }: MobileMenuProps) => {
    return (
        <GenericModalContainer
            onClose={onClose}
            isShowing={showModal}
            additionalClassNames="w-[26.4rem] h-[32.2rem] top-[calc(6.4rem+1.6rem)] translate-y-[0] dark:bg-[#2B2C37]"
            backdropModifications="top-[6.4rem]"
        >
            {children}
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </GenericModalContainer>
    );
};

export default MobileMenu;
