'use client';

import BoardListButton from '@/components/UI/Button/BoardListButton';
import { FallbackProps } from 'react-error-boundary';

const BoardListFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <BoardListButton onClick={resetErrorBoundary} className={'bg-red fill-white text-white hover:bg-red-hover'}>
            Error! Click to try again
        </BoardListButton>
    );
};

export default BoardListFallback;
