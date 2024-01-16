'use client';

import ThemeSwitcher from '@/components/UI/ThemeSwitch';
import { useAppTheme } from '@/hooks/useAppTheme';
import useViewport from '@/hooks/useViewport';
import LogoLightMode from '@/public/assets/logo-dark.svg';
import LogoDarkMode from '@/public/assets/logo-light.svg';
import { useAppSelector } from '@/services/redux/hooks';
import { selectShowSidebar } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';
import Image from 'next/image';
import BoardManager from '../BoardManager/BoardManager';
import ToggleSidebarButton from './ToggleSidebarButton';

const Sidebar = () => {
    const showSidebar = useAppSelector(selectShowSidebar);
    const [currentTheme] = useAppTheme();
    const logo = currentTheme === 'dark' ? LogoDarkMode : LogoLightMode;
    const [isMobile] = useViewport();

    if (isMobile) {
        return null;
    }

    return (
        <aside
            className={cn(
                !showSidebar && 'tablet:ml-[-26rem] desktop:ml-[-30rem]',
                'relative flex h-screen flex-col gap-[5.4rem] border-r border-lines-light bg-white px-[1.2rem] py-12 transition-margin duration-[400ms] dark:border-lines-dark dark:bg-grey-dark tablet:w-[26rem] tablet:min-w-[26rem] desktop:w-[30rem] desktop:min-w-[30rem] desktop:px-[2.4rem]',
            )}>
            <Image src={logo} alt="kanban-logo" className="h-[2.5rem] pl-[1.2rem]" />
            <BoardManager />
            <ThemeSwitcher />
            <ToggleSidebarButton />
        </aside>
    );
};

export default Sidebar;
