import { DetailedHTMLProps, FormHTMLAttributes } from 'react';

interface FormProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {}

const Form = ({ children, ...restProps }: FormProps) => {
    return (
        <form autoComplete="off" className="flex max-w-full flex-col gap-[2.4rem]" {...restProps}>
            {children}
        </form>
    );
};

export default Form;
