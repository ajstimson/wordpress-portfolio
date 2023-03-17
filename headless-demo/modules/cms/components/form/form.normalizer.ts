import { normalizeField } from "./normalizers/field.normalizer";
import { FormRaw } from "./types/form.raw.types";
import { FormProps } from "./types/form.types";

export const normalizeForm = ({
  form: { fields: rawFields, id, title, description },
}: FormRaw): FormProps => {
  return {
    type: "Form",
    id,
    title,
    description,
    fields: rawFields.map(normalizeField).filter((x) => x),
  };
};
