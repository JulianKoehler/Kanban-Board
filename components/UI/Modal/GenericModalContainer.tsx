type Props = {
  children: React.ReactNode;
  additionalClassNames?: string;
};

const GenericModalContainer = ({
  children,
  additionalClassNames = "",
}: Props) => {
  return (
    <div
      className={`z-10 flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark ${additionalClassNames}`}
    >
      {children}
    </div>
  );
};

export default GenericModalContainer;
