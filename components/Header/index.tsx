import { Board } from "@/types/data";
import Image from "next/image";
import Button from "../UI/Button";
import OptionsIcon from "../../public/assets/icon-vertical-ellipsis.svg";

type Props = {
  boardName: Board["name"];
};

const Header = ({ boardName }: Props) => {
  return (
    <header className="flex h-[9.6rem] items-center justify-between border-b border-lines-light bg-white pr-[3.2rem] pl-[2.4rem] dark:border-lines-dark dark:bg-grey-dark">
      <h1 className="text-2xl font-bold">{boardName}</h1>
      <div className="flex gap-[2rem]">
        <Button large variant="primary">
          +Add New Task
        </Button>
        <button className="px-[0.4rem]">
          <Image src={OptionsIcon} alt="options" />
        </button>
      </div>
    </header>
  );
};

export default Header;
