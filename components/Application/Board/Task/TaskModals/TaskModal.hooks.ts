import { emptyFormValues } from '@/services/context/task-modal/helpers';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { useEffect } from 'react';

export const useInitTaskCreationModal = () => {
    const { dispatchTask, activeModal } = useTaskModalContext();

    useEffect(() => {
        !activeModal && emptyFormValues(dispatchTask);
    }, [activeModal]);
};
