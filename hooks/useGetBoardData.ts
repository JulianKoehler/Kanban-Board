import { restApi } from '@/services/redux/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSearchParams } from 'next/navigation';

const useGetBoardData = () => {
    const id = useSearchParams().get('id');
    const result = restApi.boards.useGetBoardDataByIdQuery(id ? id : skipToken);

    return result;
};

export default useGetBoardData;
