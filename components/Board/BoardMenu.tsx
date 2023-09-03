import { useRef, useState } from "react";
import Image from "next/image";
import useMenuHandler from "@/hooks/useMenuHandler";
import OptionsIcon from "@/public/assets/icon-vertical-ellipsis.svg";
import DropDownContainer from "../UI/DropDown/DropDownContainer";
import BoardModal from "./BoardModal";
import DeletionWarning from "../UI/Modal/DeletionWarning";
import {
  useDeleteBoardMutation,
  useGetBoardDataQuery,
  useGetBoardListQuery,
} from "@/redux/slices/apiSlice";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActiveBoard, setActiveBoard } from "@/redux/slices/boardSlice";
import { selectUser } from "@/redux/slices/authSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const BoardMenu = () => {
  const dispatch = useAppDispatch();
  const boardMenuRef = useRef<HTMLDivElement>(null);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardWarning, setShowDeleteBoardWarning] = useState(false);
  const user = useAppSelector(selectUser);
  const activeBoard = useAppSelector(selectActiveBoard);
  const { data: boardList } = useGetBoardListQuery(user?.uid ?? "");
  const { data: board } = useGetBoardDataQuery(activeBoard?.id ?? skipToken);
  const [deleteBoard, boardDeletion] = useDeleteBoardMutation();
  const { showElement: showBoardMenu, setShowElement: setShowBoardMenu } =
    useMenuHandler(boardMenuRef);

  function handleEditCurrentBoard() {
    setShowEditBoardModal(true);
  }

  async function handleDeleteCurrentBoard() {
    const response = deleteBoard(board!).unwrap();

    toast.promise(response, {
      loading: "Sending...",
      success: `Your board has been deleted`,
      error: (err) => `Could not delete your board: ${err.toString()}`,
    });

    await response;

    setShowDeleteBoardWarning(false);
    dispatch(
      setActiveBoard(boardList?.length === 1 ? undefined : boardList![0])
    );
  }

  return (
    <>
      <button
        onClick={() => setShowBoardMenu((prevState) => !prevState)}
        className="duration 300 rounded-full p-[1rem] transition-all hover:bg-gray-200"
      >
        <Image src={OptionsIcon} alt="options" />
      </button>
      {showBoardMenu && (
        <DropDownContainer
          additionalClassNames="absolute right-0 top-[6rem]"
          ref={boardMenuRef}
        >
          <button
            onClick={handleEditCurrentBoard}
            className="w-full rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Edit Board
          </button>

          <button
            onClick={() => setShowDeleteBoardWarning(true)}
            className="rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Delete Board
          </button>
        </DropDownContainer>
      )}
      {showEditBoardModal && (
        <BoardModal
          board={board}
          onClose={() => setShowEditBoardModal(false)}
        />
      )}
      {showDeleteBoardWarning && (
        <DeletionWarning
          title={board?.name ?? ""}
          type="board"
          onClose={() => setShowDeleteBoardWarning(false)}
          deleteFunction={handleDeleteCurrentBoard}
          isLoading={boardDeletion.isLoading}
        />
      )}
    </>
  );
};

export default BoardMenu;
