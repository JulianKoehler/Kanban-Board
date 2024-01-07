import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { UserInfoReturn } from '@/types/data/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRouteProtection = (user: UserInfoReturn | undefined, isLoading: boolean) => {
    const dispatch = useAppDispatch();
    const { replace } = useRouter();

    useEffect(() => {
        !user && !isLoading && replace('/login');
        user && dispatch(login(user));
    }, [user, isLoading]);
};
