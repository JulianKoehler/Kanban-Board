import Image from "next/image";
import { ChangeEventHandler } from "react";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import ThemeSwitcher from "@/components/UI/ThemeSwitcher";
import HideIcon from "../UI/Icons/HideIcon";

type Props = {
  boardManager: React.ReactNode;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    ChangeEventHandler<HTMLInputElement>;
};

const Sidebar = ({ boardManager, theme, setTheme }: Props) => {
  const logo = theme === "dark" ? LogoDarkMode : LogoLightMode;
  return (
    <aside className="flex h-full flex-col gap-[5.4rem] border-r border-lines-light bg-white px-[2.4rem] py-12 dark:border-lines-dark dark:bg-grey-dark desktop:min-w-[30rem]">
      <Image src={logo} alt="kanban as logo" />
      {boardManager}
      <ThemeSwitcher setTheme={setTheme} theme={theme} />
      <button className="relative left-[-2.4rem] flex items-center gap-[1.6rem] rounded-r-[2.4rem] fill-grey-medium py-[1.4rem] pl-[3.2rem] text-lg font-bold text-grey-medium transition-colors duration-300 hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white">
        <HideIcon />
        Hide Sidebar
      </button>
    </aside>
  );
};

export default Sidebar;
