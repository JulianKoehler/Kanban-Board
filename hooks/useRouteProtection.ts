import { restApi } from '@/services/redux/api';
import { useAppDispatch } from '@/services/redux/hooks';
import { login } from '@/services/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRouteProtection = () => {
    const dispatch = useAppDispatch();
    const { replace } = useRouter();
    const { data: user, isLoading } = restApi.users.useGetCurrenUserInfoQuery();

    useEffect(() => {
        !user && !isLoading && replace('/login');
        user && dispatch(login(user));
    }, [user, isLoading]);
};
