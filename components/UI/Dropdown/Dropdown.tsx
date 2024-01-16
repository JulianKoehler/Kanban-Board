import useMenuHandler from '@/hooks/useMenuHandler';
import { ContextException } from '@/lib/exceptions';
import { cn } from '@/util/combineStyles';
import { HTMLAttributes, PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import DropdownContainer from './DropdownContainer';

type DropdownContext = {
    selectedOption: string;
    handleSelectOption: (value: string, label: string) => void;
};

const DropdownContext = createContext<DropdownContext | null>(null);

interface DropdownProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
    onChangeCallback?: (value: string, label: string) => void;
    selected?: string;
}

const Dropdown = ({ children, className, onChangeCallback, selected, ...props }: DropdownProps) => {
    const [selectedOption, setselectedOption] = useState(selected || '');
    const dropDownRef = useRef<HTMLDivElement>(null);
    const bottomContainer = useRef<HTMLDivElement>(null);
    const { showElement: showDropDown, setShowElement: setShowDropDown } = useMenuHandler(dropDownRef);

    function handleSelectOption(value: string, label: string) {
        !!onChangeCallback && onChangeCallback(value, label);
        setselectedOption(label);
        setShowDropDown(false);
    }

    useEffect(() => {
        bottomContainer.current?.scrollIntoView({ behavior: 'smooth' });
    }, [showDropDown]);

    return (
        <DropdownContext.Provider value={{ selectedOption, handleSelectOption }}>
            <div
                role="select"
                aria-roledescription="select"
                className="relative max-w-full"
                ref={dropDownRef}
                {...props}>
                <div
                    onClick={() => setShowDropDown(prevState => !prevState)}
                    className="flex min-h-[4.1rem] w-full cursor-pointer items-center justify-between rounded-md border-[0.1rem] border-lines-light px-[1.6rem] py-[0.8rem] hover:border-purple-main">
                    <p className="max-w-[23rem] overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium tablet:max-w-[37rem]">
                        {selectedOption}
                    </p>
                    <div className="h-4 w-[1.2rem] bg-dropDownArrowDown bg-contain bg-center bg-no-repeat" />
                </div>
                <DropdownContainer show={showDropDown} className="w-full max-w-[42rem] rounded-none rounded-b-xl">
                    {children}
                    <div aria-hidden ref={bottomContainer} className={cn(!showDropDown && 'hidden')} />
                </DropdownContainer>
            </div>
        </DropdownContext.Provider>
    );
};

interface OptionProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
    value: string;
    label?: string;
}

const Option = ({ children, className, value, label, ...props }: OptionProps) => {
    const { selectedOption, handleSelectOption } = useDropdownContext();
    const isSelected = selectedOption === value;
    let _label = children;

    if (typeof children !== 'string' && !label) {
        throw new TypeError('Either provide a string as children or use the label prop');
    }

    if (label) {
        _label = label;
    }

    return (
        <div
            {...props}
            role="option"
            aria-roledescription="option"
            aria-selected={isSelected}
            className={cn(
                'max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-[1.6rem] py-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800',
                className,
            )}
            onClick={() => handleSelectOption(value, _label as string)}>
            {children}
        </div>
    );
};

Dropdown.Option = Option;

export default Dropdown;

const useDropdownContext = () => {
    const context = useContext(DropdownContext);
    const contextMessage = 'useDropdownContext';
    const componentMessage = 'Select';

    if (!context) {
        throw new ContextException(contextMessage, componentMessage);
    }

    return context;
};
