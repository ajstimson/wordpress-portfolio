import { UseFormRegister, FieldValues, Control } from "react-hook-form";
import { FormFieldBase, FormFieldSection } from "../../types/form.types";

export type FormInputProps<TField extends FormFieldBase | FormFieldSection> = {
  field: TField;
  register: UseFormRegister<FieldValues>;
};
