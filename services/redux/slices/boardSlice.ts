import { BoardListItem } from '@/types/data/board';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TaskState } from '@/services/context/task-modal/types';

export type BoardsState = {
    activeBoard: Omit<BoardListItem, 'createdAt'> | undefined;
    showSidebar: boolean;
    isMobile: boolean | undefined;
    showMobileMenu: boolean;
    currentlyDraggingTask: TaskState | undefined;
};

const initialState: BoardsState = {
    activeBoard: undefined,
    showSidebar: true,
    isMobile: undefined,
    showMobileMenu: false,
    currentlyDraggingTask: undefined,
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
        setCurrentlyDraggingTask: (state, action: PayloadAction<TaskState | undefined>) => {
            state.currentlyDraggingTask = action.payload;
        },
    },
});

export const { setActiveBoard, setShowSidebar, setIsMobile, setShowMobileMenu, setCurrentlyDraggingTask } =
    boardSlice.actions;

export const selectActiveBoard = (state: RootState) => state.boards.activeBoard;
export const selectShowSidebar = (state: RootState) => state.boards.showSidebar;
export const selectIsMobile = (state: RootState) => state.boards.isMobile;
export const selectShowMobileMenu = (state: RootState) => state.boards.showMobileMenu;
export const selectCurrentlyDraggingTask = (state: RootState) => state.boards.currentlyDraggingTask;

export default boardSlice.reducer;
