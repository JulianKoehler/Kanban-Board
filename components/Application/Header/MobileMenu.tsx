import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import ThemeSwitcher from '@/components/UI/ThemeSwitch';
import { ChangeEventHandler } from 'react';
import BoardManager from '../Sidebar/BoardManager/BoardManager';

export type MobileMenuProps = {
    show: boolean;
    onClose: VoidFunction;
};

const MobileMenu = ({ show, onClose }: MobileMenuProps) => {
    return (
        <GenericModalContainer
            onClose={onClose}
            isShowing={show}
            additionalClassNames="w-[26.4rem] h-[32.2rem] top-[calc(6.4rem+1.6rem)] translate-y-[0] dark:bg-[#2B2C37]"
            backdropModifications="top-[6.4rem]"
        >
            <BoardManager />
            <ThemeSwitcher />
        </GenericModalContainer>
    );
};

export default MobileMenu;
