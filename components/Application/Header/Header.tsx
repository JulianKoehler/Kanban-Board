import useViewport from '@/hooks/useViewport';
import { cn } from '@/util/combineStyles';
import HeaderLogo from './HeaderLogo';
import BoardTitle from './BoardTitle';
import MobileBoardSelector from './MobileBoardSelector';
import UserActions from './UserActions';

const Header = () => {
    const [isMobile] = useViewport();

    return (
        <>
            <header
                className={cn(
                    isMobile ? 'h-[6.4rem]' : 'h-[9.6rem]',
                    'flex max-w-[100%] items-center justify-start gap-8 border-b border-lines-light bg-white pl-[1.6rem] pr-[0.6rem] dark:border-lines-dark dark:bg-grey-dark tablet:pl-[2.4rem] tablet:pr-[2.2rem]',
                )}
            >
                <HeaderLogo />
                <BoardTitle />
                <MobileBoardSelector />
                <UserActions />
            </header>
        </>
    );
};

export default Header;
