import { restApi } from '@/redux/api';
import { useRouteProtection } from './useRouteProtection';

export const useGetCurrentUser = () => {
    const { data: user, isLoading: isLoadingUser } = restApi.users.useGetCurrenUserInfoQuery();
    useRouteProtection(user, isLoadingUser);

    return [user] as const;
};
