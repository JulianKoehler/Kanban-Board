import Image from "next/image";
import UnhideIcon from "@/public/assets/icon-show-sidebar.svg";
import LogoLightMode from "@/public/assets/logo-dark.svg";
import LogoDarkMode from "@/public/assets/logo-light.svg";
import ThemeSwitcher from "@/components/UI/ThemeSwitch";
import HideIcon from "../UI/Icons/HideIcon";
import useViewport from "@/hooks/useViewport";
import { SidebarProps } from "@/types/component-props/sidebar.model";

const Sidebar = ({
  boardManager,
  showSidebar,
  setShowSidebar,
  theme,
  setTheme,
}: SidebarProps) => {
  const logo = theme === "dark" ? LogoDarkMode : LogoLightMode;
  const [isMobile] = useViewport();

  return (
    <>
      {!isMobile && (
        <aside
          className={`${
            !showSidebar && "tablet:ml-[-26rem] desktop:ml-[-30rem]"
          } relative flex h-screen flex-col gap-[5.4rem] border-r border-lines-light bg-white py-12 px-[1.2rem] transition-margin duration-[400ms] dark:border-lines-dark dark:bg-grey-dark tablet:w-[26rem] tablet:min-w-[26rem] desktop:w-[30rem] desktop:min-w-[30rem] desktop:px-[2.4rem]`}
        >
          <Image
            src={logo}
            alt="kanban-logo"
            className="h-[2.5rem] pl-[1.2rem]"
          />
          {boardManager}
          <ThemeSwitcher setTheme={setTheme} theme={theme} />
          <button
            onClick={() => setShowSidebar(false)}
            className="relative left-[-2.4rem] flex items-center gap-[1.6rem] rounded-r-[2.4rem] fill-grey-medium py-[1.4rem] pl-[3.2rem] text-lg font-bold text-grey-medium transition-colors duration-300 hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white"
          >
            <HideIcon />
            Hide Sidebar
          </button>
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute right-[-5.6rem] bottom-[3.2rem] z-10 flex h-[4.8rem] w-[5.6rem] items-center justify-center rounded-r-full bg-purple-main hover:bg-purple-main-hover "
            >
              <Image src={UnhideIcon} alt="Unhide Sidebar" />
            </button>
          )}
        </aside>
      )}
    </>
  );
};

export default Sidebar;
