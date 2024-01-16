import { UserInfoReturn } from '@/types/data/user';
import { Dispatch } from 'react';
import { ActionTypes, Actions, BoardState } from './types';

export function initFormValues(dispatch: Dispatch<Actions>, boardData: BoardState | undefined, user: UserInfoReturn) {
    if (!!boardData) {
        dispatch({ type: ActionTypes.SET_BOARD_TITLE, payload: { title: boardData.title } });
        dispatch({ type: ActionTypes.SET_INITIAL_STAGES, payload: { stages: boardData.stages } });
        dispatch({
            type: ActionTypes.SET_INITIAL_CONTRIBUTORS,
            payload: { contributors: boardData.contributors },
        });
        dispatch({ type: ActionTypes.SET_INITIAL_OWNER, payload: { user: boardData.owner } });
    } else {
        dispatch({ type: ActionTypes.SET_BOARD_TITLE, payload: { title: '' } });
        dispatch({
            type: ActionTypes.SET_INITIAL_STAGES,
            payload: {
                stages: [
                    {
                        id: '',
                        index: 0,
                        color: '#49C4E5',
                        title: '',
                    },
                ],
            },
        });
        dispatch({ type: ActionTypes.SET_INITIAL_CONTRIBUTORS, payload: { contributors: [] } });
        dispatch({ type: ActionTypes.SET_INITIAL_OWNER, payload: { user } });
    }
    dispatch({ type: ActionTypes.SET_IS_FORM_SUBMITTED, payload: false });
}
