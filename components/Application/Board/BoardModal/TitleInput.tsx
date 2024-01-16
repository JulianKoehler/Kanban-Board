import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import Input from '@/components/UI/InputFields/TextInput';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { ChangeEvent } from 'react';

const TitleInput = () => {
    const { boardData, dispatchBoard } = useBoardModalContext();
    const { title, isFormSubmitted } = boardData;

    function setTitle(e: ChangeEvent<HTMLInputElement>) {
        dispatchBoard({ type: ActionTypes.SET_BOARD_TITLE, payload: { title: e.target.value } });
    }

    return (
        <FormGroup>
            <H5>Name</H5>
            <Input
                className={isFormSubmitted && title.length < 1 ? 'input-error' : ''}
                value={title}
                onChange={e => setTitle(e)}
                placeholder="e.g. Web Design"
            />
            {isFormSubmitted && title.length < 1 && (
                <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">Can't be empty</p>
            )}
        </FormGroup>
    );
};

export default TitleInput;
