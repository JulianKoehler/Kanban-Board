import { useAppDispatch } from '@/services/redux/hooks';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { useSearchParams } from 'next/navigation';
import { useGetBoardList } from './useGetBoardList';

const useActivateBoard = () => {
    const dispatch = useAppDispatch();
    const boardId = useSearchParams().get('id');
    const [_, allBoards] = useGetBoardList();
    const activeBoard = allBoards.find(board => board.id === boardId);

    !!activeBoard && dispatch(setActiveBoard(activeBoard));

    return [activeBoard];
};

export default useActivateBoard;
