import Image from 'next/image';
import useViewport from '@/hooks/useViewport';
import { useAppSelector } from '@/redux/hooks';
import { selectShowSidebar } from '@/redux/slices/boardSlice';
import LogoLightMode from '@/public/assets/logo-dark.svg';
import LogoDarkMode from '@/public/assets/logo-light.svg';
import LogoMobile from '@/public/assets/logo-mobile.svg';
import { useAppTheme } from '@/hooks/useAppTheme';


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
