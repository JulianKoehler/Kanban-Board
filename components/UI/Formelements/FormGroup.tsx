import { cn } from '@/util/combineStyles';
import { DetailedHTMLProps, FieldsetHTMLAttributes } from 'react';

interface FormGroupProps extends DetailedHTMLProps<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement> {
    className?: string;
}

const FormGroup = ({ children, className = '', ...rest }: FormGroupProps) => {
    return (
        <fieldset {...rest} className={cn('relative flex max-w-full flex-col gap-[1.6rem]', className)}>
            {children}
        </fieldset>
    );
};

export default FormGroup;
