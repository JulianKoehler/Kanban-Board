import IconLightMode from '@/public/assets/icon-light-theme.svg';
import IconDarkMode from '@/public/assets/icon-dark-theme.svg';
import Image from 'next/image';
import { useAppTheme } from '@/hooks/useAppTheme';
import { cn } from '@/util/combineStyles';

const ThemeSwitcher = () => {
    const [currentTheme, setCurrentTheme] = useAppTheme();
    const isDarkMode = currentTheme === 'dark';

    return (
        <div className="mt-auto flex min-h-[4.8rem] w-full items-center justify-center rounded-md bg-grey-light dark:bg-grey-very-dark tablet:mb-[-4rem]">
            <Image src={IconLightMode} alt="light-mode" />
            <label
                className="mx-9 inline-block h-8 w-16 cursor-pointer rounded-[1.2rem] bg-purple-main transition-transform duration-300 hover:bg-purple-main-hover"
                htmlFor="themeSwitch"
            >
                <input className="hidden" type="checkbox" id="themeSwitch" onChange={setCurrentTheme} />
                <div className={cn(isDarkMode ? 'translate-x-[2.3rem]' : 'translate-x-[0.3rem]', 'relative transition-transform duration-[400ms] ease-in-out before:absolute before:top-[0.3rem] before:flex before:h-[1.4rem] before:w-[1.4rem] before:rounded-full before:bg-white before:content-[""]')} />
            </label>
            <Image src={IconDarkMode} alt="dark-mode" />
        </div>
    );
};

export default ThemeSwitcher;
