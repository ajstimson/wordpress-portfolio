import React from "react";
import { FormFieldChoices } from "../../../types/form.types";
import { FormInputProps } from "../types";
import classnames from "classnames";

export const FormInputCheckbox: React.FC<FormInputProps<FormFieldChoices>> = ({
  field,
  register,
}) => {
  return (
    <>
      {field.options.map((option, index) => {
        return (
          <div className={classnames("checkbox-liner", {
            required : field.required
          })} key={`${field.name}-${index}`}>
            <input
              type={field.type}
              {...register(field.name)}
              value={option.value}
              defaultChecked={option.checked}
            />
            <label
              className="checkbox-label"
              key={`${field.name}-${index}-label`}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </>
  );
};
