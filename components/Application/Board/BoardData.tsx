import Stage from '@/components/Application/Board/Stages/Stage';
import Task from '@/components/Application/Board/Task/Task';
import { BoardDataResponse } from '@/types/data/board';

type BoardDataProps = {
    data: BoardDataResponse;
};

const BoardData = ({ data }: BoardDataProps) => {
    return (
        <>
            {data?.stages?.map(stage => (
                <Stage key={stage.id} stage={stage}>
                    {stage.tasks?.map((task, idx) => (
                        <Task key={task.id} currentBoard={data} task={task} index={idx} />
                    ))}
                </Stage>
            ))}
        </>
    );
};

export default BoardData;
