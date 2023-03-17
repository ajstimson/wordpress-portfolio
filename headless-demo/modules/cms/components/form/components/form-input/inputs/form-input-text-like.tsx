import React from "react";
import { FormFieldText } from "../../../types/form.types";
import { FormInputProps } from "../types";

export const FormInputTextLike: React.FC<FormInputProps<FormFieldText>> = ({
  field,
  register,
}) => {
  return (
    <input
      type={field.hidden ? 'hidden' : field.type}
      {...register(field.name)}
      required={field.required}
    />
  );
};
