import { CMSComponent } from "../../types";

/**
 * Normalized Types
 */

export enum FormFieldType {
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SELECT = "select",
  PHONE = "phone",
  TEXT = "text",
  TEXTAREA = "textarea",
  EMAIL = "email",
  DATE = "date",
  FORM_SECTION = "form_section",
  LABEL = 'label'
}

export interface FormFieldBase {
  name: string;
  required: boolean;
  hidden: boolean;
  label: string;
  fieldDescription: string;
}

export interface FormFieldText extends FormFieldBase {
  type:
    | FormFieldType.TEXT
    | FormFieldType.TEXTAREA
    | FormFieldType.EMAIL
    | FormFieldType.PHONE;
  html?: string;
}

export interface FormFieldChoicesOptions {
  label: string;
  value: string;
  checked: boolean;
}

export interface FormFieldChoices extends FormFieldBase {
  type: FormFieldType.RADIO | FormFieldType.SELECT | FormFieldType.CHECKBOX;
  options: FormFieldChoicesOptions[];
}

export interface FormFieldDate extends FormFieldBase {
  type: FormFieldType.DATE;
  // these should come from wordpress
  minYear: number;
  maxYear: number;
  year: FormFieldChoices;
  month: FormFieldChoices;
  day: FormFieldChoices;
}

export interface FormFieldSection {
  name: string;
  type: FormFieldType.FORM_SECTION;
  fieldDescription: string;
  fields: FormField[];
}

export interface FormFieldLabel extends FormFieldBase {
  type: FormFieldType.LABEL;
  html: string;
}

export type FormField = FormFieldText | FormFieldChoices | FormFieldDate | FormFieldLabel;

export interface FormProps extends CMSComponent {
  id: number;
  title: string;
  description: string;
  fields: (FormField | FormFieldSection)[];
}
