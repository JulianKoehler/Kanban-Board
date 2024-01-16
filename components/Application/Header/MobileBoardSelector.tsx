import useViewport from '@/hooks/useViewport';
import ArrowDown from '@/public/assets/icon-chevron-down.svg';
import ArrowUp from '@/public/assets/icon-chevron-up.svg';
import { useAppDispatch, useAppSelector } from '@/services/redux/hooks';
import { selectShowMobileMenu, setShowMobileMenu } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

const MobileBoardSelector = () => {
    const dispatch = useAppDispatch();
    const showMobileMenu = useAppSelector(selectShowMobileMenu);
    const [isMobile] = useViewport();

    function onToggleMobileMenu() {
        dispatch(setShowMobileMenu(!showMobileMenu));
    }

    if (!isMobile) {
        return null;
    }

    return (
        <>
            <button
                className={cn(showMobileMenu ? '' : 'mt-[0.5rem]', 'flex items-center justify-center p-[0.9rem]')}
                onClick={onToggleMobileMenu}>
                <Image src={showMobileMenu ? ArrowUp : ArrowDown} alt="Open board manager" />
            </button>
            <MobileMenu show={isMobile && showMobileMenu} onClose={onToggleMobileMenu} />
        </>
    );
};

export default MobileBoardSelector;
