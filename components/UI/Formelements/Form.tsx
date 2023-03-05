import { DetailedHTMLProps, FormHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {}

const Form = ({ children, ...restProps }: Props) => {
  return (
    <form
      autoComplete="off"
      className="flex flex-col gap-[2.4rem]"
      {...restProps}
    >
      {children}
    </form>
  );
};

export default Form;
