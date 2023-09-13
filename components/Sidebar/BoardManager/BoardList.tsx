import BoardIcon from "@/components/UI/Icons/BoardIcon";
import useViewport from "@/hooks/useViewport";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActiveBoard, setActiveBoard } from "@/redux/slices/boardSlice";
import localStorageIdentifiers from "@/util/localStorageIdentifiers";
import { BoardListProps } from "@/types/component-props/boardList.model";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BoardList = ({ boardList, onMobileClose }: BoardListProps) => {
  const dispatch = useAppDispatch();
  const activeBoard = useAppSelector(selectActiveBoard);
  const [isMobile, isTablet] = useViewport();

  console.log(boardList);

  return (
    <>
      {boardList?.map((board, index) => {
        const active = activeBoard?.id === board.id;
        const maxNameLength = isTablet ? 18 : 20;

        function handleBoardSelection() {
          const newBoard = boardList![index];

          dispatch(setActiveBoard(newBoard));

          localStorage.setItem(
            localStorageIdentifiers.activeBoard,
            JSON.stringify(newBoard)
          );

          isMobile ? onMobileClose() : null;
        }

        return (
          <button
            key={board.id}
            onClick={handleBoardSelection}
            className={`relative left-[-2.4rem] flex w-[24rem] gap-[1.6rem] overflow-y-auto overflow-x-hidden whitespace-nowrap rounded-r-[2.4rem] py-[1.4rem] pl-[2.4rem] text-lg font-bold transition-colors duration-300 tablet:left-[-1.2rem] tablet:min-w-[24rem] desktop:left-[-2.4rem] desktop:w-[27.6rem] desktop:pl-[3.2rem] ${
              active && "bg-purple-main fill-white text-white"
            } ${
              !active &&
              "dark:hover:bg-white> fill-grey-medium text-grey-medium hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white"
            }`}
          >
            <BoardIcon />
            {board.name.slice(0, maxNameLength)}
            {board.name.length >= maxNameLength ? "..." : ""}
          </button>
        );
      })}
    </>
  );
};

export default BoardList;
