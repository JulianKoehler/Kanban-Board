import { ContextException } from '@/lib/exceptions';
import { ReactNode, createContext, useContext } from 'react';
import { Options, useQueryState } from 'nuqs';
import { useSearchParams } from 'next/navigation';

/**
 * Purpose of this context is to keep track of the currently selected board.
 * It only holds its ID so it is no replacement for the redux state "activeBoard"!
 * Currently it is not possible to perform shallow route updates when using the App Router
 * useQueryState performs shallow route updates so we get instant user feedback when changing boards,
 * even with a slower connection!
 */

type CurrentBoardIdIdContextProps = {
    currentBoardId: string;
    setCurrentBoardId: <Shallow>(
        value: string | ((old: string) => string | null) | null,
        options?: Options<Shallow> | undefined,
    ) => Promise<URLSearchParams>;
};

const CurrentBoardIdContext = createContext<CurrentBoardIdIdContextProps | undefined>(undefined);

export const CurrentBoardIdProvider = ({ children }: { children: ReactNode }) => {
    const initialId = useSearchParams().get('id') ?? '';
    const [currentBoardId, setCurrentBoardId] = useQueryState('id', { history: 'push', defaultValue: initialId });

    return (
        <CurrentBoardIdContext.Provider value={{ currentBoardId, setCurrentBoardId }}>
            {children}
        </CurrentBoardIdContext.Provider>
    );
};

export const useCurrentBoardIdContext = () => {
    const context = useContext(CurrentBoardIdContext);
    const contextName = 'CurrentBoardIdContext';
    const providerName = 'CurrentBoardIdProvider';

    if (!context) {
        throw new ContextException(contextName, providerName);
    }

    return context;
};
