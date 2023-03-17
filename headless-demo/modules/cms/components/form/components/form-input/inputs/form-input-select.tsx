import React from "react";
import { UseFormRegister, FieldValues, Control } from "react-hook-form";
import {
  FormFieldChoices,
  FormFieldChoicesOptions,
} from "../../../types/form.types";
import { FormInputProps } from "../types";

type Props = Omit<FormInputProps<FormFieldChoices>, "register"> & {
  options?: FormFieldChoicesOptions[];
  value?: string; // controlled mode
  onChange?: (value: string) => void;
  register?: UseFormRegister<FieldValues>;
};

export const FormInputSelect: React.FC<Props> = ({
  field,
  register,
  onChange,
  options,
  value,
}) => {
  return (
    <select
      name={register && field.name}
      {...(register && register(field.name))}
      required={field.required}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...(value ? { value: value } : {})}
    >
      {(options ?? field.options).map((option, index) => {
        return (
          <option
            key={`${field.name}-${index}`}
            value={option.value}
            {...(!value ? { defaultChecked: option.checked } : {})}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
};
