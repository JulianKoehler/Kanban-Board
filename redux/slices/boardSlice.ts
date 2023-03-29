import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoardListItem, IBoard, ITask } from "@/types/data";
import axios, { GenericAbortSignal } from "axios";
import { RootState } from "../store";
import API_URLS from "@/util/API_URLs";
import findColumn from "@/util/findColumn";

type UpdatedTask = ITask & {
  oldColumnId: string;
};

export enum STATUS {
  IDLE,
  LOADING,
  SUCCESS,
  FAILED,
}
export interface BoardsState {
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
      if (err instanceof Error) throw new Error("ERR_BOARDLIST");
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
      } else {
        throw new Error(`Boardlist item ${action.payload.name} not found.`);
      }
    },
    deleteBoardListItem: (state, action: PayloadAction<string>) => {
      state.boardList = state.boardList.filter(
        (boardItem) => boardItem.id !== action.payload
      );
      if (state.boardList.length < 1) {
        state.activeBoardData = undefined;
      }
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
    addNewTask: (state, action: PayloadAction<ITask>) => {
      const task = action.payload;
      const column = findColumn(state, action.payload);

      column?.tasks?.push(task);
    },
    updateExistingTask: (state, action: PayloadAction<UpdatedTask>) => {
      const oldColumn = state.activeBoardData!.columns!.find(
        (column) => column.id === action.payload.oldColumnId
      );
      const newColumn = state.activeBoardData!.columns!.find(
        (column) => column.id === action.payload.status.columnID
      );

      if (oldColumn) {
        oldColumn.tasks = oldColumn.tasks?.filter(
          (task) => task.id !== action.payload.id
        );
      } else {
        throw new Error("Could not find the old column with the ID provided");
      }

      if (newColumn) {
        newColumn.tasks?.push(action.payload);
      } else {
        throw new Error("Could not find the new column with the ID provided");
      }
    },
    deleteTask: (state, action: PayloadAction<ITask>) => {
      const column = state.activeBoardData?.columns?.find(
        (column) => column.id === action.payload.column
      );
      if (column) {
        column.tasks = column.tasks?.filter(
          (task) => task.id !== action.payload.id
        );
      }
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
          state.error = undefined;
        }
      )
      .addCase(getBoardList.rejected, (state) => {
        state.boardListStatus = STATUS.FAILED;
        state.error = "ERR_BOARDLIST";
      })
      .addCase(getActiveBoardData.pending, (state) => {
        state.boardDataStatus = STATUS.LOADING;
      })
      .addCase(
        getActiveBoardData.fulfilled,
        (state, action: PayloadAction<IBoard>) => {
          state.boardDataStatus = STATUS.SUCCESS;
          state.activeBoardData = action.payload;
          state.error = undefined;
        }
      )
      .addCase(getActiveBoardData.rejected, (state, action) => {
        /* Errors from the Abort controller should not be treated as a failed request */
        if (action.error.message === "canceled") {
          return;
        }
        state.boardDataStatus = STATUS.FAILED;
        state.error = "ERR_BOARDDATA";
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
  addNewTask,
  updateExistingTask,
  deleteTask,
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
