'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import { useAvoidHydrationMismatch } from './kanban.hooks';
import Sidebar from '@/components/Application/Sidebar/Sidebar';
import Header from '@/components/Application/Header/Header';
import Board from '@/components/Application/Board';
import Toaster from '@/components/UI/Toaster/Toaster';

export default function KanbanApplication() {
    const [appIsMounted] = useAvoidHydrationMismatch();
    const activeBoard = useAppSelector(selectActiveBoard);

    if (!appIsMounted) return null;

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full overflow-hidden">
                <Toaster />
                <Header />
                <Board key={activeBoard?.id} />
            </div>
        </div>
    );
}

{
    /* <Head>
                <title>{activeBoard?.title || 'Your Kanban Task Manager'}</title>
                <meta name="description" content="Your kanban app that supports your agile workflow." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head> */
}
