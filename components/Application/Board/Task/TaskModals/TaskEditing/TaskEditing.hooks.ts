import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { restApi } from '@/services/redux/api';
import { StageResponse } from '@/types/data/stages';
import { skipToken } from '@reduxjs/toolkit/query';
import { RefObject, useEffect, useRef } from 'react';

/**
 * Is needed for pessimistic updates of the State. Keeps track of the task status when the TaskEditModal was initially called.
 */

export const useInitialStatus = () => {
    const {
        taskData: { status },
    } = useTaskModalContext();

    const { currentBoardId } = useCurrentBoardIdContext();
    const { data: board } = restApi.boards.useGetBoardDataByIdQuery(currentBoardId ?? skipToken);
    const isInitialRender = useRef(true);
    const initialStatus = useRef<StageResponse | undefined>();

    useEffect(() => {
        if (isInitialRender.current) {
            initialStatus.current = board?.stages.find(stage => stage.id === status.id);
        }
        isInitialRender.current = false;
    }, []);

    return initialStatus.current;
};
