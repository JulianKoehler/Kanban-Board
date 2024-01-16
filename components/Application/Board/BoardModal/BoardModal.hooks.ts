import { initFormValues } from '@/services/context/board-modal/helpers';
import { Actions, BoardState } from '@/services/context/board-modal/types';
import { useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { useSearchParams } from 'next/navigation';
import { Dispatch, useEffect } from 'react';

export const useInitBoardModal = (
    dispatch: Dispatch<Actions>,
    showModal: boolean,
    boardData?: BoardState | undefined,
) => {
    const currentUser = useAppSelector(selectUser);
    const boardId = useSearchParams().get('id');

    useEffect(() => {
        (!showModal || boardData) && initFormValues(dispatch, boardData, currentUser!);
    }, [currentUser, showModal, boardId]);
};
