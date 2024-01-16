import { useAppDispatch } from '@/services/redux/hooks';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { useGetBoardList } from './useGetBoardList';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useEffect } from 'react';

const useActivateBoard = () => {
    const dispatch = useAppDispatch();
    const { currentBoardId } = useCurrentBoardIdContext();
    const [result, allBoards] = useGetBoardList();
    const activeBoard = allBoards.find(board => board.id === currentBoardId);
   

    useEffect(() => {
        dispatch(setActiveBoard(activeBoard));
    }, [currentBoardId, result.status]);

    return activeBoard;
};

export default useActivateBoard;
