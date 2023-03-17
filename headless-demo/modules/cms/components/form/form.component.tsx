import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { FormProps } from "./types/form.types";
import { FormInput, FormInputField } from "./components/form-input/form-input";

const RECAPTCHAKEY = process.env.GOOGLE_RECAPCHA_KEY;

export const FormComponent: React.FC<FormProps> = ({
  fields,
  id,
  title,
  description,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  console.log({ errors });

  const { mutate, isLoading, data, isError } = useMutation(async (data) => {
    console.log("SUBMIT", data);

    const response = await fetch(`/api/form/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  });

  const submit = async (data: any) => {
    mutate(data);
  };

  if (data) {
    return <div dangerouslySetInnerHTML={{__html: data.message}} />;
  }

  const onVerifyCaptcha = (token) => {
    setValue("captchaToken", token);
  };

  return (
    <section className="form-section">
      <div className="liner">
        {isError && <div>Please fix error</div>}

        <form id={`form-${id}`} onSubmit={handleSubmit(submit)}>
          <div>
            <h4 dangerouslySetInnerHTML={{ __html: title }} />
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>

          {fields.map((field, index) => {
            return (
              <FormInput
                field={field}
                register={register}
                key={`${Array.isArray(field) ? index : field.name}`}
              />
            );
          })}

          <div className="submit">
            <GoogleReCaptchaProvider
              reCaptchaKey="6Lc6efsbAAAAAG9264SdCkxFTvmtcLIPMIo6YvKp"
              scriptProps={{
                async: false, // optional, default to false,
                defer: false, // optional, default to false
                appendTo: "head", // optional, default to "head", can be "head" or "body",
                nonce: undefined, // optional, default undefined
              }}
            >
              <button type="submit">Submit</button>
            </GoogleReCaptchaProvider>
          </div>
        </form>
      </div>
    </section>
  );
};
