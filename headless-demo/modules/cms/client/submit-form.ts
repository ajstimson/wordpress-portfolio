import {map } from 'lodash'

const API_KEY = process.env.GRAVITY_FORMS_KEY;
const API_SECRET = process.env.GRAVITY_FORMS_SECRET;

//https://staging.example.com/wp-json/gf/v2/forms/3/submissions
const URL_MAP = {
    staging: "https://staging.example.com/wp-json",
    production: "https://production.example.com/wp-json",
  };
  
  const URL = URL_MAP[process.env.ENVIRONMENT || "staging"];

export const submitForm = async (
  id: number,
  data: Record<string, string | number>
): Promise<{ confirmation_message: string }> => {
  console.log("DATA", data)

  // const dataToSend = {}

  // for (const [key, value] of Object.entries(data)) {
  //   if (Array.isArray(value)) {
  //     value.forEach((x, index) => {})
  //   }
  // }

  const response = await fetch(`${URL}/gf/v2/forms/${id}/submissions`, {
    method: "POST",
    headers: {
        'Authorization': `Basic ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log("STATUS", response.status)

  if (!response.ok) {
    console.log('TEXT', await response.text());

    // TODO: validation if needed
    if (response.status === 404) {
      throw new Error("Not Found");
    } else {
        throw new Error("Something went wrong...")
    }
  }

  return response.json();
};
