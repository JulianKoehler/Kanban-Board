import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoardListItem, IBoard } from "@/types/data";
import axios, { GenericAbortSignal } from "axios";
import { RootState } from "../store";
import API_URLS from "@/util/API_URLs";

export enum STATUS {
  IDLE,
  LOADING,
  SUCCESS,
  FAILED,
}

interface BoardsState {
  boardList: BoardListItem[];
  activeBoard: BoardListItem | undefined;
  activeBoardData: IBoard | undefined;
  boardListStatus: STATUS;
  boardDataStatus: STATUS;
  error: string | undefined;
}

const initialState: BoardsState = {
  boardList: [],
  activeBoard: undefined,
  activeBoardData: undefined,
  boardListStatus: STATUS.IDLE,
  boardDataStatus: STATUS.IDLE,
  error: undefined,
};

export const getBoardList = createAsyncThunk(
  "boards/setInitialBoardList",
  async () => {
    try {
      const response = await axios.get(API_URLS.getAllBoards);
      return response.data.boards;
    } catch (err) {
      console.log(err);
      if (err instanceof Error) return err.message;
    }
  }
);

export const getActiveBoardData = createAsyncThunk(
  "boards/getActiveBoardData",
  async ({ id, signal }: { id: string; signal: GenericAbortSignal }) => {
    try {
      const response = await axios.get(API_URLS.getSpecificBoard + id, {
        signal: signal,
      });

      return response.data;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
);

export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoardList: (state, action: PayloadAction<BoardListItem[]>) => {
      state.boardList = action.payload;
    },
    updateBoardList: (state, action: PayloadAction<BoardListItem>) => {
      const boardListItem = state.boardList.find(
        (board) => board.id === action.payload.id
      );

      if (boardListItem) {
        boardListItem.id = action.payload.id;
        boardListItem.name = action.payload.name;
        boardListItem.index = action.payload.index;
      }
    },
    deleteBoardListItem: (state, action: PayloadAction<string>) => {
      state.boardList = state.boardList.filter(
        (boardItem) => boardItem.id !== action.payload
      );
    },
    setActiveBoard: (state, action: PayloadAction<BoardListItem>) => {
      state.activeBoard = action.payload;
    },
    addBoard: (state, action: PayloadAction<BoardListItem>) => {
      state.boardList.push(action.payload);
    },
    setBoardData: (state, action: PayloadAction<IBoard>) => {
      state.activeBoardData = action.payload;
    },
    updateColumns: (state, action: PayloadAction<IBoard>) => {
      state.activeBoardData!.columns = action.payload.columns;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBoardList.pending, (state) => {
        state.boardListStatus = STATUS.LOADING;
      })
      .addCase(
        getBoardList.fulfilled,
        (state, action: PayloadAction<BoardListItem[]>) => {
          state.boardListStatus = STATUS.SUCCESS;
          state.boardList = action.payload;
          state.activeBoard = action.payload[0] ?? undefined;
        }
      )
      .addCase(getBoardList.rejected, (state, action) => {
        state.boardListStatus = STATUS.FAILED;
        state.error = action.error.message;
      })
      .addCase(getActiveBoardData.pending, (state) => {
        state.boardDataStatus = STATUS.LOADING;
      })
      .addCase(
        getActiveBoardData.fulfilled,
        (state, action: PayloadAction<IBoard>) => {
          state.boardDataStatus = STATUS.SUCCESS;
          state.activeBoardData = action.payload;
        }
      )
      /* Errors from the Abort controller should not be treated as a failed request */
      .addCase(getActiveBoardData.rejected, (state, action) => {
        if (action.error.message !== "canceled") {
          state.boardDataStatus = STATUS.FAILED;
          state.error = action.error.message;
        }
      });
  },
});

export const {
  setBoardList,
  setActiveBoard,
  addBoard,
  updateBoardList,
  setBoardData,
  updateColumns,
  deleteBoardListItem,
} = boardSlice.actions;

export const selectBoardList = (state: RootState) => state.boards.boardList;
export const selectActiveBoard = (state: RootState) => state.boards.activeBoard;
export const selectactiveBoardData = (state: RootState) =>
  state.boards.activeBoardData;
export const selectBoardListStatus = (state: RootState) =>
  state.boards.boardListStatus;
export const selectBoardDataStatus = (state: RootState) =>
  state.boards.boardDataStatus;
export const selectError = (state: RootState) => state.boards.error;

export default boardSlice.reducer;
