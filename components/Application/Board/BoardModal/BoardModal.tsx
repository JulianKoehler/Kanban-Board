import { BoardModalProvider } from '@/services/context/board-modal/board-modal-context';
import { BoardState } from '@/services/context/board-modal/types';
import BoardCreation from './BoardCreation';
import BoardEditing from './BoardEditing';

export interface BoardModalProps {
    initialBoard?: BoardState;
    showModal: boolean;
    onClose: () => void;
}

const BoardModal = ({ initialBoard, showModal, onClose }: BoardModalProps) => {
    const isEditMode = !!initialBoard;

    const commonProps = { showModal, onClose };
    const creationProps = { ...commonProps };
    const editingProps = { ...commonProps, initialBoard };

    const ModalComponent = isEditMode ? BoardEditing : BoardCreation;
    const modalProps = isEditMode ? editingProps : creationProps;


    return (
        <BoardModalProvider boardData={initialBoard}>
            <ModalComponent {...modalProps} />
        </BoardModalProvider>
    );
};

export default BoardModal;
