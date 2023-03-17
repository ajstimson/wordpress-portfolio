import type { Response } from "node-fetch";
import { normalizeUrls } from "../normalizers/normalize-urls";

export const preProcessResponse = async (response: Response): Promise<any> => {
    const text = await response.text()
    const normalized = normalizeUrls(text)
    const json = JSON.parse(normalized)
    return json
}