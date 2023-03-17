import { Page } from '../types'

export const getHeader = async (): Promise<any> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/header`);
    const json = (await response.json());
    if (!json) {
      throw new Error("Did not receive data");
    }
    return json;
  } catch (err) {
    console.log(err);
    return null
  }
};
