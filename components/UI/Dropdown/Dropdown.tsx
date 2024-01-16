import DropDownContainer from '@/components/UI/Dropdown/DropdownContainer';
import useMenuHandler from '@/hooks/useMenuHandler';
import { cn } from '@/util/combineStyles';
import { useEffect, useRef, useState } from 'react';

type OptionBaseShape = {
    id: string;
    title: string;
}

type DropDownProps<T extends OptionBaseShape> = {
    currentOption?: string;
    dropDownOptions: Array<T>;
    onOptionChange: (id: string, title: string, rest: T) => void;
};

const DropDown = <T extends OptionBaseShape>({ currentOption, dropDownOptions, onOptionChange }: DropDownProps<T>) => {
    const dropDownRef = useRef<HTMLDivElement>(null);
    const bottomContainer = useRef<HTMLDivElement>(null);
    const { showElement: showDropDown, setShowElement: setShowDropDown } = useMenuHandler(dropDownRef);
    const [selectedOption, setSelectedOption] = useState(currentOption);

    function handleSelectOption(option: T) {
        onOptionChange(option.id, option.title, {...option});
        setSelectedOption(option.title);
        setShowDropDown(false);
    }

    useEffect(() => {
        bottomContainer.current?.scrollIntoView({ behavior: 'smooth' });
    }, [showDropDown]);

    return (
        <div role="select" className="relative max-w-full" ref={dropDownRef}>
            <button
                type="button"
                onClick={() => setShowDropDown(prevState => !prevState)}
                className="flex w-full min-h-[4.1rem] items-center justify-between rounded-md border-[0.1rem] border-lines-light px-[1.6rem] py-[0.8rem] hover:border-purple-main"
            >
                <p className="max-w-[23rem] overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium tablet:max-w-[37rem]">
                    {selectedOption}
                </p>
                <div className="h-4 w-[1.2rem] bg-dropDownArrowDown bg-contain bg-center bg-no-repeat" />
            </button>
            <DropDownContainer
                show={showDropDown}
                additionalClassNames={`w-full max-w-[42rem] rounded-none rounded-b-xl`}
            >
                {dropDownOptions.map((option, index) => (
                    <p
                        key={option.id}
                        role="option"
                        onClick={() => handleSelectOption(option)}
                        className={cn(
                            index === dropDownOptions.length - 1 ? 'rounded-b-xl' : '',
                            'max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-[1.6rem] py-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800',
                        )}
                    >
                        {option.title}
                    </p>
                ))}
                <div ref={bottomContainer} className={cn(!showDropDown && 'hidden')} />
            </DropDownContainer>
        </div>
    );
};

export default DropDown;
