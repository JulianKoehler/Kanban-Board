import { useEffect } from 'react';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { restApi } from '@/services/redux/api';

const useGetBoardData = () => {
    const { currentBoardId } = useCurrentBoardIdContext();
    const [trigger, result] = restApi.boards.useLazyGetBoardDataByIdQuery();

    useEffect(() => {
        trigger(currentBoardId, true);
    }, [currentBoardId]);

    return result;
};

export default useGetBoardData;
