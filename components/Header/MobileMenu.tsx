import React, { ChangeEventHandler } from "react";
import GenericModalContainer from "../UI/Modal/GenericModalContainer";
import BoardManager from "../Sidebar/BoardManager";
import ThemeSwitcher from "../UI/ThemeSwitch";
import { useTheme } from "next-themes";

type Props = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>> &
    ChangeEventHandler<HTMLInputElement>;
  onClose: VoidFunction;
};

const MobileMenu = ({ theme, setTheme, onClose }: Props) => {
  return (
    <GenericModalContainer
      onClose={onClose}
      additionalClassNames="w-[26.4rem] h-[32.2rem] top-[calc(6.4rem+1.6rem)] translate-y-[0] dark:bg-[#2B2C37]"
      backdropModifications="top-[6.4rem]"
    >
      <BoardManager onMobileClose={onClose} />
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </GenericModalContainer>
  );
};

export default MobileMenu;
