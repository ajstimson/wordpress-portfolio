import { Field } from "@theme-ui/components";
import { getYear } from "date-fns";
import { merge } from "lodash";
import {
  FormFieldRaw,
  FormInputsRaw,
  FormFieldChoicesRaw,
  FormFieldTypeRaw,
  FormFieldHTMLRaw,
  FormFieldBaseRaw,
  FormFieldWithInputsRaw,
  FormFieldBasicRaw,
} from "../types/form.raw.types";
import {
  FormField,
  FormFieldBase,
  FormFieldChoices,
  FormFieldDate,
  FormFieldSection,
  FormFieldType,
  FormFieldLabel,
} from "../types/form.types";

const normalizeName = (id: string | number): string => `input_${id}`;

const normalizeBase = (raw: FormFieldBaseRaw): FormFieldBase => {
  return {
    label: raw.label,
    name: normalizeName(raw.id),
    required: raw.isRequired,
    fieldDescription: raw.description,
    hidden: raw.isHidden || false,
  };
};

const normalizeCheckbox = (raw: FormFieldWithInputsRaw): FormFieldChoices => {
  return {
    ...normalizeBase(raw),
    type: FormFieldType.CHECKBOX,
    options: (
      merge(raw.inputs, raw.choices) as (FormInputsRaw & FormFieldChoicesRaw)[]
    ).map((x) => ({
      checked: x.isSelected,
      label: x.label,
      value: x.value,
    })),
  };
};

const normalizeOptionLike = (raw: FormFieldWithInputsRaw): FormFieldChoices => {
  return {
    ...normalizeBase(raw),
    type: FormFieldType[raw.type.toUpperCase()],
    options: raw.choices.map((x) => ({
      checked: x.isSelected,
      label: x.text,
      value: x.value,
    })),
  };
};

const normalizeTextLike = (
  raw: FormFieldBasicRaw | FormFieldHTMLRaw
): FormField => ({
  ...normalizeBase(raw),
  type:
    raw.type === FormFieldTypeRaw.HTML
      ? FormFieldType.TEXT
      : FormFieldType[raw.type.toUpperCase()],
  html: raw.content,
});

const normalizeDate = (raw: FormFieldWithInputsRaw): FormFieldDate => {
  const [monthInput, dayInput, yearInput] = raw.inputs;

  const nowYear = getYear(new Date());

  return {
    ...normalizeBase(raw),
    type: FormFieldType.DATE,
    minYear: nowYear - 65,
    maxYear: nowYear,
    year: {
      label: yearInput.label,
      name: normalizeName(yearInput.id),
      required: raw.isRequired,
      hidden: raw.isHidden || false,
      // these 3 are ugly
      options: [],
      type: FormFieldType.SELECT,
      fieldDescription: raw.description,
    },
    month: {
      label: monthInput.label,
      name: normalizeName(monthInput.id),
      required: raw.isRequired,
      hidden: raw.isHidden || false,
      // these 3 are ugly
      options: [],
      type: FormFieldType.SELECT,
      fieldDescription: raw.description,
    },
    day: {
      label: dayInput.label,
      name: normalizeName(dayInput.id),
      required: raw.isRequired,
      hidden: raw.isHidden || false,
      // these 3 are ugly
      options: [],
      type: FormFieldType.SELECT,
      fieldDescription: raw.description,
    },
  };
};

const requiredAddressFields = [
  'address-line1',
  'address-level2',
  'postal-code',
  // 'country-name'
]

export const normalizeLabel = (raw: FormFieldRaw): FormFieldLabel => ({
  ...normalizeBase(raw),
  type: FormFieldType.LABEL,
  html: raw.content 
})

export const normalizeField = (
  raw: FormFieldRaw
): FormField | FormFieldSection | null => {
  const { type } = raw;

  switch (raw.type) {
    case FormFieldTypeRaw.CHECKBOX:
      return normalizeCheckbox(raw);
    case FormFieldTypeRaw.RADIO:
    case FormFieldTypeRaw.SELECT:
      return normalizeOptionLike(raw);
    case FormFieldTypeRaw.TEXT:
    case FormFieldTypeRaw.TEXTAREA:
    case FormFieldTypeRaw.EMAIL:
    case FormFieldTypeRaw.PHONE:
      return normalizeTextLike(raw);
    case FormFieldTypeRaw.HTML:
      return normalizeLabel(raw);
    case FormFieldTypeRaw.DATE:
      return normalizeDate(raw);
    // special case, address is nested but we use text boxes
    case FormFieldTypeRaw.ADDRESS:
      return {
        type: FormFieldType.FORM_SECTION,
        name: "address",
        fieldDescription: raw.description,
        fields: raw.inputs
          .map<FormFieldBasicRaw>((input, index) => ({
            ...raw,
            ...input,
            isRequired: requiredAddressFields.includes(input.autocompleteAttribute),
            type: FormFieldTypeRaw.TEXT,
          }))
          .map(normalizeTextLike),
      };

    default:
      console.log(`Did not find normalizer for type ${type}`);
      return null;
  }
};
