import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { submitForm } from '../../../modules/cms/client/submit-form'

const URL_MAP = {
  staging: "https://staging.example.com/wp-json/wp/v2",
  production: "https://production.example.com/wp-json/wp/v2",
};

const URL = URL_MAP[process.env.ENVIRONMEMT || "staging"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    const { id } = req.query
    const idNumber = Number(id)

    // TODO: better error handling
    if (!data || !id || !idNumber) {
        throw new Error("Something went wrong...")
    }

    const response = await submitForm(idNumber, data)
    res.json({
        message: response.confirmation_message
    })
}