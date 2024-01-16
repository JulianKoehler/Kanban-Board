import { restApi } from '@/services/redux/api';
import { useEffect } from 'react';
import { useGetCurrentUser } from './useGetCurrentUser';
import { QueryStatus } from '@reduxjs/toolkit/query';

/**
 *
 * @returns [queryResult, allBoards]
 */
export const useGetBoardList = () => {
    const [getBoardList, queryResult] = restApi.boards.useLazyGetBoardListQuery();
    const [user] = useGetCurrentUser();
    const allBoards = [...(queryResult.data?.own_boards ?? []), ...(queryResult.data?.contributing ?? [])];

    useEffect(() => {
        user && getBoardList(undefined, true);
    }, [user, queryResult.status]);

    return [queryResult, allBoards] as const;
};
