'use server';

import { BASE_URL } from '@/services/redux/api/api';
import { UserInfoReturn } from '@/types/data/user';

type RequestCookie = {
    name: string;
    value: string;
};

/**
 * Utility function to retrieve the auth status server side. RTK Query doesn't attach the cookies
 * on a server side fetch.
 */
export const getCurrentUser = async (token: RequestCookie | undefined) => {
    if (!token) {
        return;
    }

    const response = await fetch(`${BASE_URL}/users/current`, {
        headers: {
            Cookie: `${token?.name}=${token?.value}`,
        },
    });
    const user: UserInfoReturn = await response.json();

    return user;
};
