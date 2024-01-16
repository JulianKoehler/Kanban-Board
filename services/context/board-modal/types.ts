import { StageUpdate } from '@/types/data/stages';
import { ContributorUpdate, UserInfoReturn } from '@/types/data/user';
import { Dispatch, ReactNode } from 'react';

export type BoardState = {
    title: string;
    stages: StageUpdate[];
    contributors: ContributorUpdate[];
    owner: UserInfoReturn;
    isFormSubmitted: boolean;
};

export type BoardModalProviderProps = {
    children: ReactNode;
    boardData?: BoardState;
};

export enum ActionTypes {
    SET_BOARD_TITLE,
    SET_STAGE_TITLE,
    SET_STAGE_COLOR,
    ADD_STAGE,
    ADD_CONTRIBUTOR,
    REMOVE_STAGE,
    REMOVE_CONTRIBUTOR,
    PROMOTE_TO_OWNER,
    SET_IS_FORM_SUBMITTED,
    SET_INITIAL_STAGES,
    SET_INITIAL_CONTRIBUTORS,
    SET_INITIAL_OWNER,
}

export type Actions =
    | {
          type: ActionTypes.SET_BOARD_TITLE;
          payload: { title: string };
      }
    | {
          type: ActionTypes.SET_STAGE_TITLE;
          payload: { title: string; index: number };
      }
    | {
          type: ActionTypes.SET_STAGE_COLOR;
          payload: { color: string; index: number };
      }
    | {
          type: ActionTypes.ADD_STAGE;
          payload: {
              stage: StageUpdate;
          };
      }
    | {
          type: ActionTypes.ADD_CONTRIBUTOR;
          payload: { user: ContributorUpdate };
      }
    | {
          type: ActionTypes.REMOVE_STAGE;
          payload: { index: number };
      }
    | {
          type: ActionTypes.REMOVE_CONTRIBUTOR;
          payload: { user: ContributorUpdate };
      }
    | {
          type: ActionTypes.PROMOTE_TO_OWNER;
          payload: { user: UserInfoReturn };
      }
    | {
          type: ActionTypes.SET_IS_FORM_SUBMITTED;
          payload: boolean;
      }
    | {
          type: ActionTypes.SET_INITIAL_STAGES;
          payload: { stages: StageUpdate[] };
      }
    | {
          type: ActionTypes.SET_INITIAL_CONTRIBUTORS;
          payload: { contributors: ContributorUpdate[] };
      }
    | {
          type: ActionTypes.SET_INITIAL_OWNER;
          payload: { user: UserInfoReturn };
      };

export type BoardModalContextProps = {
    boardData: BoardState;
    dispatchBoard: Dispatch<Actions>;
};
