import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  > {
  additionalClasses?: string;
}

const FormGroup = ({ children, additionalClasses = "", ...rest }: Props) => {
  return (
    <fieldset
      {...rest}
      className={`relative flex max-w-full flex-col gap-[1.6rem] ${additionalClasses}`}
    >
      {children}
    </fieldset>
  );
};

export default FormGroup;
