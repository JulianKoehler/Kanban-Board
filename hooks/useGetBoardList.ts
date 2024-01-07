import { restApi } from '@/redux/api';
import { useEffect } from 'react';
import { useGetCurrentUser } from './useGetCurrentUser';

export const useGetBoardList = () => {
    const [getBoardList, boardListResult] = restApi.boards.useLazyGetBoardListQuery();
    const [user] = useGetCurrentUser();

    useEffect(() => {
        user && getBoardList();
    }, [user]);

    return [boardListResult] as const;
};
