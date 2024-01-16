import { UserInfoReturn } from '@/types/data/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
    isAuthenticated: boolean;
    user: UserInfoReturn | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserInfoReturn>) => {
            if (!action.payload) {
                state.isAuthenticated = false;
            }
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: state => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
