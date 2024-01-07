import { NewUserPassword, PasswordRequestReset, UserCreate, UserInfoReturn, UserLogin, UserReturn } from '@/types/data/user';
import { api } from '../api';
import { buildFormDataPayloadString, parseLoginData } from './helpers';
import { HTTPExceptionResponse } from './types';

export const authApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation<UserReturn | HTTPExceptionResponse, UserCreate>({
            query: ({ userName, email, password }) => ({
                url: 'users/',
                method: 'POST',
                body: {
                    user_name: userName,
                    email,
                    password,
                },
            }),
            invalidatesTags: ['UserData'],
        }),
        login: builder.mutation<UserInfoReturn, UserLogin>({
            query: userCredentials => ({
                url: 'login',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: buildFormDataPayloadString(parseLoginData(userCredentials)),
            }),
            invalidatesTags: ['UserData'],
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),
        requestPasswordReset: builder.mutation<HTTPExceptionResponse | null, PasswordRequestReset>({
            query: email => ({
                url: 'password/request-reset',
                method: 'POST',
                body: email,
            }),
        }),
        setNewPassword: builder.mutation<HTTPExceptionResponse | null, NewUserPassword>({
            query: data => ({
                url: 'password/new',
                method: 'POST',
                body: {
                    access_token: data.accessToken,
                    token_type: data.tokenType,
                    password: data.password,
                },
            }),
        }),
    }),
});
