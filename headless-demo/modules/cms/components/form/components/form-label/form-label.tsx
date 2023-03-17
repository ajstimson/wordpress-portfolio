import React from "react";
import { FormField, FormFieldType } from "../../types/form.types";

type Props = {
  field: FormField;
};

export const FormLabel: React.FC<Props> = ({ field }) => {
  if (field.type === FormFieldType.LABEL) {
    return (
      <label
        dangerouslySetInnerHTML={{
          __html: field.html,
        }}
      />
    );
  }

  return <label>{field.label}</label>;
};
