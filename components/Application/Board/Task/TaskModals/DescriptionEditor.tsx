import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import React, { ChangeEvent } from 'react';

const DescriptionEditor = () => {
    const {
        dispatchTask,
        taskData: { description },
    } = useTaskModalContext();

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        dispatchTask({ type: TaskActionTypes.SET_DESCRIPTION, payload: { content: e.target.value } });
    }

    return (
        <FormGroup>
            <H5>Description</H5>
            <textarea
                value={description}
                onChange={handleChange}
                className="h-[11.2rem] w-full resize-none rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.9rem] text-base invalid:border-red focus:border-purple-main focus:outline-none dark:bg-grey-dark"
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
            />
        </FormGroup>
    );
};

export default DescriptionEditor;
