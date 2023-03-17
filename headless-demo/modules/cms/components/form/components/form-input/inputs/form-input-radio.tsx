import React from "react";
import { FormFieldChoices } from "../../../types/form.types";
import { FormInputProps } from "../types";

export const FormInputRadio: React.FC<FormInputProps<FormFieldChoices>> = ({
  field,
  register,
}) => {
  return (
    <>
      {field.options.map((option, index) => {
        return (
          <div className="radio-liner" key={`${field.name}-${index}`}>
            <input
              type={field.type}
              {...register(field.name)}
              required={field.required}
              value={option.value}
              defaultChecked={option.checked}
            />
            <label key={`${field.name}-${index}-label`}>
              <span className="check-mark">
                <span></span>
              </span>
              <span className="title">{option.label}</span>
            </label>
          </div>
        );
      })}
    </>
  );
};
