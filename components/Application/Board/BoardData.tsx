import Stage from '@/components/Application/Board/Stages/Stage';
import Task from '@/components/Application/Board/Task/Task';
import { BoardDataResponse } from '@/types/data/board';
import { RefObject, forwardRef } from 'react';

type BoardDataProps = {
    data: BoardDataResponse | undefined;
};

const BoardData = ({ data }: BoardDataProps) => {
    if (!data?.stages) {
        return null;
    }

    const { stages } = data;

    return (
        <>
            {stages.map(stage => (
                <Stage key={stage.id} stage={stage}>
                    {stage.tasks.map(task => (
                        <Task key={task.id} task={task} />
                    ))}
                </Stage>
            ))}
        </>
    );
};

export default BoardData;
