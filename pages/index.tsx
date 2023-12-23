import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BoardManager from '@/components/Sidebar/BoardManager';
import Board from '@/components/Board';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import BoardList from '@/components/Sidebar/BoardManager/BoardList';
import { SkeletonTheme } from 'react-loading-skeleton';
import { restApi } from '@/redux/api';
import { login } from '@/redux/slices/authSlice';

export default function Kanban() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { data: user, isLoading: isLoadingUser } = restApi.users.useGetCurrenUserInfoQuery();

    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [appIsMounted, setAppIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean | undefined>();
    const activeBoard = useAppSelector(selectActiveBoard);

    const { theme, systemTheme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const skeletonBaseColor = theme === 'dark' ? '#1f1d24' : '#dbdbdb';
    const skeletonHighlightColor = theme === 'dark' ? '#2c2d33' : '#c2c2c2';

    const [getBoardList, boardListResult] = restApi.boards.useLazyGetBoardListQuery();
    const allBoards = [...(boardListResult.data?.own_boards ?? []), ...(boardListResult.data?.contributing ?? [])];

    useEffect(() => {
        !user && !isLoadingUser && router.replace('/login');
        user && dispatch(login(user)) && getBoardList();
    }, [user, isLoadingUser]);

    useEffect(() => {
        setAppIsMounted(true);
    }, []);

    if (!appIsMounted) return null;

    function handleThemeChange() {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function onToggleMobileMenu() {
        setShowMobileMenu(bool => !bool);
    }

    return (
        <>
            <Head>
                <title>{activeBoard?.title || 'Your Kanban Task Manager'}</title>
                <meta name="description" content="Your kanban app that supports your agile workflow." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
                <Sidebar
                    theme={currentTheme!}
                    setTheme={handleThemeChange}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    boardManager={
                        <BoardManager
                            boardListLength={(allBoards && allBoards.length) ?? 0}
                            isLoading={boardListResult.isLoading}
                        >
                            <BoardList boardList={allBoards} onMobileClose={() => null} />
                        </BoardManager>
                    }
                />
                <div className="w-full overflow-hidden">
                    <div>
                        <Toaster
                            toastOptions={{
                                style: {
                                    borderRadius: '4rem',
                                    background: theme === 'dark' ? '#2B2C37' : '#F4F7FD',
                                    color: theme === 'dark' ? 'white' : 'black',
                                },
                            }}
                        />
                    </div>
                    <Header
                        showSidebar={showSidebar}
                        theme={currentTheme!}
                        setTheme={handleThemeChange}
                        onToggleMobileMenu={onToggleMobileMenu}
                        showMobileMenu={showMobileMenu}
                        setIsMobile={(isMobile: boolean) => setIsMobile(isMobile)}
                    >
                        {isMobile && (
                            <BoardManager
                                boardListLength={(allBoards && allBoards.length) ?? 0}
                                isLoading={boardListResult.isLoading}
                            >
                                <BoardList boardList={allBoards} onMobileClose={onToggleMobileMenu} />
                            </BoardManager>
                        )}
                    </Header>
                    <Board key={activeBoard?.id} />
                </div>
            </SkeletonTheme>
        </>
    );
}
