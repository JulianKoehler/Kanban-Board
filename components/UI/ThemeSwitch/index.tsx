import IconLightMode from "@/public/assets/icon-light-theme.svg";
import IconDarkMode from "@/public/assets/icon-dark-theme.svg";
import Image from "next/image";

type Props = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    React.ChangeEventHandler<HTMLInputElement>;
};

const ThemeSwitcher = ({ theme, setTheme }: Props) => {
  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light";

  return (
    <div className="mt-auto flex min-h-[4.8rem] w-full items-center justify-center rounded-md bg-grey-light dark:bg-grey-very-dark tablet:mb-[-4rem]">
      <Image src={IconLightMode} alt="light-mode" />
      <label
        className="mx-9 inline-block h-8 w-16 cursor-pointer rounded-[1.2rem] bg-purple-main transition-transform duration-300 hover:bg-purple-main-hover"
        htmlFor="themeSwitch"
      >
        <input
          className="hidden"
          type="checkbox"
          id="themeSwitch"
          onChange={setTheme}
        />
        <div
          className={`w relative transition-transform duration-[400ms] ease-in-out before:absolute before:top-[0.3rem] ${
            isDarkMode && "translate-x-[2.3rem]"
          } ${
            isLightMode && "translate-x-[0.3rem]"
          } before:flex before:h-[1.4rem] before:w-[1.4rem] before:rounded-full before:bg-white before:content-['']`}
        ></div>
      </label>
      <Image src={IconDarkMode} alt="dark-mode" />
    </div>
  );
};

export default ThemeSwitcher;
