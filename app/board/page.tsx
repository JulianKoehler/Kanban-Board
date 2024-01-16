import Board from '@/components/Application/Board/Board';
import BoardFallback from '@/components/UI/Fallbacks/Error/BoardFallback';
import { ErrorBoundary } from 'react-error-boundary';

type PageParams = {
    params: {};
    searchParams: { id?: string };
};

const BoardPage = ({ searchParams }: PageParams) => {
    const boardId = searchParams?.id;

    return (
        <ErrorBoundary FallbackComponent={BoardFallback}>
            <Board key={boardId} />
        </ErrorBoundary>
    );
};

export default BoardPage;
