import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type ContainerProps = {
  children: React.ReactNode;
  additionalClassNames?: string;
};

type ModalProps = ContainerProps & {
  onClose?: () => void;
  backdropModifications?: string | "";
};

type BackdropProps = {
  mods?: string | "";
  onClick?: () => void;
};

const Backdrop = ({ mods, onClick }: BackdropProps) => {
  return (
    <div
      onClick={onClick}
      className={`fixed top-0 left-0 z-30 h-screen w-full bg-modal-backdrop ${mods}`}
    />
  );
};

const ModalOverlay = ({
  children,
  additionalClassNames = "",
}: ContainerProps) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 z-40 flex h-fit max-h-[90%] max-w-[90%] translate-x-[-50%] translate-y-[-50%] flex-col overflow-auto rounded-xl bg-white p-[2.4rem] shadow-sm dark:bg-grey-very-dark tablet:overflow-visible tablet:p-[3.2rem] ${additionalClassNames}`}
    >
      {children}
    </div>
  );
};

const GenericModalContainer = ({
  onClose,
  children,
  additionalClassNames,
  backdropModifications,
}: ModalProps) => {
  const backdrop = useRef<Element | null>(null);
  const modalOverlay = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    backdrop.current = document.querySelector<HTMLElement>("#backdrop");
    modalOverlay.current = document.querySelector<HTMLElement>("#overlay");
    setMounted(true);
  }, []);

  return mounted && backdrop.current && modalOverlay.current ? (
    <>
      {ReactDOM.createPortal(
        <Backdrop mods={backdropModifications} onClick={onClose} />,
        backdrop.current
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          additionalClassNames={additionalClassNames}
          children={children}
        />,
        modalOverlay.current
      )}
    </>
  ) : null;
};

export default GenericModalContainer;
