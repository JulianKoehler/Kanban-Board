import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BoardListItem } from '@/types/data/board';

export type BoardsState = {
    activeBoard: Omit<BoardListItem, 'createdAt'> | undefined;
    showSidebar: boolean;
    isMobile: boolean | undefined;
    showMobileMenu: boolean;
};

const initialState: BoardsState = {
    activeBoard: undefined,
    showSidebar: true,
    isMobile: undefined,
    showMobileMenu: false,
};

export const boardSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        setActiveBoard: (state, action: PayloadAction<Omit<BoardListItem, 'createdAt'> | undefined>) => {
            state.activeBoard = action.payload;
        },
        setShowSidebar: (state, action: PayloadAction<boolean>) => {
            state.showSidebar = action.payload;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
        setShowMobileMenu: (state, action: PayloadAction<boolean>) => {
            state.showMobileMenu = action.payload;
        },
    },
});

export const { setActiveBoard, setShowSidebar, setIsMobile, setShowMobileMenu } = boardSlice.actions;

export const selectActiveBoard = (state: RootState) => state.boards.activeBoard;
export const selectShowSidebar = (state: RootState) => state.boards.showSidebar;
export const selectIsMobile = (state: RootState) => state.boards.isMobile;
export const selectShowMobileMenu = (state: RootState) => state.boards.showMobileMenu;

export default boardSlice.reducer;
