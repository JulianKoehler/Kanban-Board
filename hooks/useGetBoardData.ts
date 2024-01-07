import { restApi } from '@/redux/api';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import { useEffect } from 'react';

const useGetBoardData = () => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [getBoardData, { data: board, isFetching: isFetchingBoardData }] =
        restApi.boards.useLazyGetBoardDataByIdQuery();

    useEffect(() => {
        activeBoard && getBoardData(activeBoard.id);
    }, [activeBoard]);

    return [board, isFetchingBoardData] as const;
};

export default useGetBoardData;
