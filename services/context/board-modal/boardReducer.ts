import { ActionTypeException } from '@/lib/exceptions';
import { ActionTypes, Actions, BoardState } from './types';

export const boardReducer = (state: BoardState, action: Actions): BoardState => {
    switch (action.type) {
        case ActionTypes.SET_BOARD_TITLE:
            return { ...state, title: action.payload.title };

        case ActionTypes.SET_STAGE_TITLE: {
            const stages = [...state.stages];
            const { index, title } = action.payload;

            stages[index] = {
                ...stages[index],
                title,
            };

            return { ...state, stages };
        }

        case ActionTypes.SET_STAGE_COLOR: {
            const stages = [...state.stages];
            const { index, color } = action.payload;

            stages[index] = {
                ...stages[index],
                color,
            };

            return { ...state, stages };
        }

        case ActionTypes.ADD_STAGE:
            return { ...state, stages: [...state.stages, action.payload.stage] };

        case ActionTypes.ADD_CONTRIBUTOR: {
            const { user } = action.payload;
            const contributors = [...state.contributors];
            const recentlyDeleted = contributors.some(
                contributor => contributor.id === user.id && contributor?.markedForDeletion,
            );

            if (recentlyDeleted) {
                const userIndex = contributors.findIndex(item => item.id === user.id);
                contributors[userIndex] = { ...user, markedForDeletion: false, isNew: false };
                return { ...state, contributors };
            }

            return { ...state, contributors: [...state.contributors, { ...user, isNew: true }] };
        }

        case ActionTypes.REMOVE_STAGE: {
            const { index } = action.payload;
            const stages = [...state.stages];
            const isNewStage = stages[index].id === '';

            stages[index] = {
                ...stages[index],
                markedForDeletion: true,
            };

            // Remove newly created stages directly in the frontend before submitting them to the API
            if (isNewStage) {
                stages.splice(index, 1);
            }

            return { ...state, stages };
        }

        case ActionTypes.REMOVE_CONTRIBUTOR: {
            const { user } = action.payload;

            if (user?.isNew) {
                const updatedState = {
                    ...state,
                    contributors: state.contributors.filter(contrib => contrib.id !== user.id),
                };

                return updatedState;
            }

            const contributors = [...state.contributors];

            const index = contributors.findIndex(contributor => contributor.id === user.id);
            contributors[index] = {
                ...contributors[index],
                markedForDeletion: true,
            };

            return { ...state, contributors };
        }

        case ActionTypes.PROMOTE_TO_OWNER: {
            const { user } = action.payload;

            const updatedContributors = [
                state.owner,
                ...state.contributors.filter(contributor => contributor.id !== user.id),
            ];

            return { ...state, owner: user, contributors: updatedContributors };
        }

        case ActionTypes.SET_IS_FORM_SUBMITTED:
            return { ...state, isFormSubmitted: action.payload };

        case ActionTypes.SET_INITIAL_STAGES:
            return { ...state, stages: action.payload.stages };

        case ActionTypes.SET_INITIAL_CONTRIBUTORS:
            return { ...state, contributors: action.payload.contributors };

        case ActionTypes.SET_INITIAL_OWNER:
            return { ...state, owner: action.payload.user };

        default:
            throw new ActionTypeException<ActionTypes | string>([...Object.values(ActionTypes)]);
    }
};
