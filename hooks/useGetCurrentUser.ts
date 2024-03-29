import { restApi } from '@/services/redux/api';
import { useRouteProtection } from './useRouteProtection';

export const useGetCurrentUser = () => {
    const { data: user, isLoading: isLoadingUser } = restApi.users.useGetCurrenUserInfoQuery();
    useRouteProtection();

    return [user, isLoadingUser] as const;
};
