import Dropdown from '@/components/UI/Dropdown/Dropdown';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import { Status } from '@/types/data/stages';

type ShallowStatusChangerProps = {
    statusOptions: Status[];
};

const ShallowStatusChanger = ({ statusOptions }: ShallowStatusChangerProps) => {
    const {
        dispatchTask,
        taskData: { status, isFormSubmitted },
    } = useTaskModalContext();

    function handleStatusChange(id: string, title: string) {
        const status = { id, title };
        dispatchTask({ type: TaskActionTypes.SET_STATUS, payload: { status } });
    }

    const isError = isFormSubmitted && !status.id;

    return (           
        <FormGroup>
            <H5>Status</H5>
            <Dropdown
                selected={status.title}
                onChangeCallback={handleStatusChange}
                className={isError ? 'input-error' : ''}>
                {statusOptions.map(({ id, title }) => (
                    <Dropdown.Option key={id} value={id}>
                        {title}
                    </Dropdown.Option>
                ))}
            </Dropdown>
            {isError && (
                <p className="absolute bottom-[0.9rem] right-[4rem] text-base font-medium text-red">Can't be empty</p>
            )}
        </FormGroup>
    );
};

export default ShallowStatusChanger;
