import React from "react";
import {
  FormField,
  FormFieldSection,
  FormFieldType,
} from "../../types/form.types";
import { FormInputProps } from "./types";
import { FormInputTextarea } from "./inputs/form-input-text-area";
import { FormInputTextLike } from "./inputs/form-input-text-like";
import { FormInputSelect } from "./inputs/form-input-select";
import { FormInputRadio } from "./inputs/form-input-radio";
import { FormInputCheckbox } from "./inputs/form-input-checkbox";
import { FormInputDate } from "./inputs/form-input-date";
import { FormLabel } from "../form-label/form-label";
import classnames from "classnames";

export const FormInputField: React.FC<FormInputProps<FormField>> = ({
  field,
  register,
}) => {
  const { type } = field;

  const baseProps = {
    register,
  };

  switch (field.type) {
    case FormFieldType.TEXTAREA:
      return <FormInputTextarea field={field} {...baseProps} />;
    case FormFieldType.TEXT:
    case FormFieldType.EMAIL:
    case FormFieldType.PHONE:
      return <FormInputTextLike field={field} {...baseProps} />;
    case FormFieldType.SELECT:
      return <FormInputSelect field={field} {...baseProps} />;
    case FormFieldType.RADIO:
      return <FormInputRadio field={field} {...baseProps} />;
    case FormFieldType.CHECKBOX:
      return <FormInputCheckbox field={field} {...baseProps} />;
    case FormFieldType.DATE:
      return <FormInputDate field={field} {...baseProps} />;
    default:
      throw new Error(`Component for type ${type} not found.`);
  }
};

type FormInputComponentProps = FormInputProps<FormField | FormFieldSection> & {
  hideFieldDescription?: boolean;
};

export const FormInput: React.FC<FormInputComponentProps> = ({
  field,
  register,
  hideFieldDescription = false,
}) => {
  if (field.type === FormFieldType.FORM_SECTION) {
    return (
      <div
        className={classnames(
          "form-field-section",
          `form-field-section-${field.name}`
        )}
      >
        {field.fields.map((x) => (
          <FormInput
            key={`${x.name}`}
            field={x}
            register={register}
            hideFieldDescription
          />
        ))}
        <sup dangerouslySetInnerHTML={{ __html: field.fieldDescription }} />
      </div>
    );
  }

  if (field.hidden) {
    return <FormInputField field={field} register={register} />;
  }

  const className = `field type-${field.type}`

  if (field.type === FormFieldType.LABEL) {
    return (<div className={className}>
      <FormLabel field={field} />
    </div>)
  }

  return (
    <div className={className}>
      <FormLabel field={field} />
      <FormInputField field={field} register={register} />
      {field.fieldDescription && !hideFieldDescription && (
        <sup dangerouslySetInnerHTML={{ __html: field.fieldDescription }} />
      )}
    </div>
  );
};
