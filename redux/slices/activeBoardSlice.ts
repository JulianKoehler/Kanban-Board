import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { BoardListItem, IBoard } from "@/types/data";

interface BoardListState {
  board: IBoard | undefined;
}

const initialState: BoardListState = {
  board: undefined,
};

export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  reducers: {
    setBoardData: (state, action: PayloadAction<IBoard>) => {
      state.board = action.payload;
    },
  },
});

export const { setBoardData } = activeBoardSlice.actions;

export default activeBoardSlice.reducer;
