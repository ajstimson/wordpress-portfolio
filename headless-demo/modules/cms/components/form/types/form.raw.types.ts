/**
 * Raw Types
 */

export interface FormRaw {
  form: {
    id: number;
    title: string;
    description: string;
    button: {
      type: string;
      text: string;
    };
    fields: FormFieldRaw[];
  };
}

export enum FormFieldTypeRaw {
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SELECT = "select",
  PHONE = "phone",
  TEXT = "text",
  TEXTAREA = "textarea",
  EMAIL = "email",
  DATE = "date",
  HTML = "html",
  ADDRESS = "address",
}

export interface FormFieldChoicesRaw {
  text: string;
  value: string;
  isSelected: boolean;
}

export interface FormFieldBaseRaw {
  // definitely needed
  type: FormFieldTypeRaw;
  choices?: FormFieldChoicesRaw[];
  content?: string;
  isRequired: boolean;
  isHidden: boolean;
  label: string;
  // to process
  id: number | string;
  size: string;
  errorMessage: string;
  visibility: string;
  nameFormat: string;
  description: string;
}

export interface FormFieldBasicRaw extends FormFieldBaseRaw {
  type:
    | FormFieldTypeRaw.EMAIL
    | FormFieldTypeRaw.PHONE
    | FormFieldTypeRaw.TEXT
    | FormFieldTypeRaw.TEXTAREA;
}

export interface FormFieldWithInputsRaw extends FormFieldBaseRaw {
  type:
    | FormFieldTypeRaw.RADIO
    | FormFieldTypeRaw.CHECKBOX
    | FormFieldTypeRaw.SELECT
    | FormFieldTypeRaw.DATE;
  inputs: FormInputsRaw[];
}

export interface FormFieldAddressRaw extends FormFieldBaseRaw {
  type: FormFieldTypeRaw.ADDRESS;
  inputs: { id: string; label: string; name: string, autocompleteAttribute: string }[];
}

export interface FormFieldHTMLRaw extends FormFieldBaseRaw {
  type: FormFieldTypeRaw.HTML;
  content: string;
}

export type FormFieldRaw =
  | FormFieldBasicRaw
  | FormFieldWithInputsRaw
  | FormFieldHTMLRaw
  | FormFieldAddressRaw;

export interface FormInputsRaw {
  id: string;
  label: string;
  name: string;
  inputType?: FormFieldTypeRaw;
  autocompleteAttribute: string;
  choices?: {
    text: string;
    value: string;
  }[];
  isHidden: boolean;
}
