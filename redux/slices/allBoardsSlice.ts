import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { BoardListItem } from "@/types/data";

interface BoardListState {
  allBoards: BoardListItem[];
}

const initialState: BoardListState = {
  allBoards: [],
};

export const allBoardsSlice = createSlice({
  name: "allBoards",
  initialState,
  reducers: {
    setAllBoards: (state, action: PayloadAction<BoardListItem[]>) => {
      state.allBoards = action.payload;
    },
    addBoard: (state, action: PayloadAction<BoardListItem>) => {
      state.allBoards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<BoardListItem>) => {
      const board = state.allBoards.find(
        (board) => board.id === action.payload.id
      );

      if (board) {
        board.id = action.payload.id;
        board.name = action.payload.name;
        board.index = action.payload.index;
      }
    },
  },
});

export const { setAllBoards, addBoard, updateBoard } = allBoardsSlice.actions;

export default allBoardsSlice.reducer;
