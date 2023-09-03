export type DeletionWarningProps = {
  type: "board" | "task" | "user";
  title: string;
  isLoading?: boolean;
  deleteFunction: VoidFunction;
  onClose: VoidFunction;
};
