import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import Input from '@/components/UI/InputFields/TextInput';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import React, { ChangeEvent } from 'react';

const TitleEditor = () => {
    const { dispatchTask, taskData } = useTaskModalContext();
    const { title, isFormSubmitted } = taskData;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        dispatchTask({ type: TaskActionTypes.SET_TITLE, payload: { event } });
    }

    return (
        <FormGroup>
            <H5>Title</H5>
            <Input
                className={isFormSubmitted && title.length < 1 ? 'input-error' : ''}
                value={title}
                onChange={handleChange}
                placeholder="e.g. Take coffee break"
            />
            {isFormSubmitted && title.length < 1 && (
                <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">Can't be empty</p>
            )}
        </FormGroup>
    );
};

export default TitleEditor;
