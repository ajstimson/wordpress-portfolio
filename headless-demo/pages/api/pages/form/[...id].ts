import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch"; // in node fetch is exported as default

const URL_MAP = {
  staging: "https://staging.example.com/wp-json/wp/v2",
  production: "https://production.example.com/wp-json/wp/v2",
};

const URL = URL_MAP[process.env.ENVIRONMEMT || "staging"];

export default async (req: NextApiRequest, res: NextApiResponse) => {

//   const response = await fetch(`${URL}/pages?slug=${req.query.slug}`);

    res.json({
        body: req.body,
        ok: true
    })
}