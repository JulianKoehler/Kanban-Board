import { useAppTheme } from '@/hooks/useAppTheme';
import useViewport from '@/hooks/useViewport';
import LogoLightMode from '@/public/assets/logo-dark.svg';
import LogoDarkMode from '@/public/assets/logo-light.svg';
import LogoMobile from '@/public/assets/logo-mobile.svg';
import { useAppSelector } from '@/services/redux/hooks';
import { selectShowSidebar } from '@/services/redux/slices/boardSlice';
import Image from 'next/image';

const HeaderLogo = () => {
    const showSidebar = useAppSelector(selectShowSidebar);
    const [currentTheme] = useAppTheme();
    const [isMobile] = useViewport();

    return (
        <>
            {!showSidebar && !isMobile && (
                <div className="flex h-full items-center border-r-[0.1rem] border-lines-light pr-[3.2rem] dark:border-lines-dark">
                    <Image src={currentTheme === 'dark' ? LogoDarkMode : LogoLightMode} alt="kanban-logo" />
                </div>
            )}
            {isMobile && (
                <div className="mr-[1.6rem]">
                    <Image src={LogoMobile} alt="kanban-logo" />
                </div>
            )}
        </>
    );
};

export default HeaderLogo;
