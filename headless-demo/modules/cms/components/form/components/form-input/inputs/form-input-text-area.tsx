import React from "react";
import { FormFieldText } from "../../../types/form.types";
import { FormInputProps } from "../types";

export const FormInputTextarea: React.FC<FormInputProps<FormFieldText>> = ({
  field,
  register,
}) => {
  return (
    <textarea rows={5} {...register(field.name)} required={field.required} />
  );
};
