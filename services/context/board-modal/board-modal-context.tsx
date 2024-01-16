import { ContextException } from '@/lib/exceptions';
import { createContext, useContext, useReducer } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import { boardReducer } from './boardReducer';
import { BoardModalContextProps, BoardModalProviderProps, BoardState } from './types';

const BoardModalContext = createContext<BoardModalContextProps | undefined>(undefined);

// Owner will be set in the Provider from Redux user state
const initialState: Omit<BoardState, 'owner'> = {
    title: '',
    stages: [
        {
            id: '',
            index: 0,
            color: '#49C4E5',
            title: '',
        },
    ],
    contributors: [],
    isFormSubmitted: false,
};

export const BoardModalProvider = ({ children, boardData = undefined }: BoardModalProviderProps) => {
    const currentUser = useAppSelector(selectUser);

    const [boardState, dispatchBoard] = useReducer(
        boardReducer,
        boardData ?? ({ ...initialState, owner: currentUser } as BoardState),
    );

    return (
        <BoardModalContext.Provider value={{ boardData: boardState, dispatchBoard }}>
            {children}
        </BoardModalContext.Provider>
    );
};

export const useBoardModalContext = () => {
    const context = useContext(BoardModalContext);
    const contextName = 'BoardContext';
    const providerName = 'BoardDataProvider';

    if (!context) {
        throw new ContextException(contextName, providerName);
    }

    return context;
};
