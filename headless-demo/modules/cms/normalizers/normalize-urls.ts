const BASE_URL = process.env.NEXT_CMS_API_BASE_URL
const HOSTNAME = BASE_URL.replace('https://', '')

export const normalizeUrls = (html: string): string => {
    // html urls
    const withoutHostnamesInAbsoluteUrls = removeHostnameInAbsoluteUrls(html)
    const withoutTrailingSlashesInUrls = removeTrailingSlashesInURLS(withoutHostnamesInAbsoluteUrls)

    // json urls
    const withoutHostnamesInAbsoluteUrlsInJson = removeHostNameInAbsoluteUrlsInJSON(withoutTrailingSlashesInUrls)    
    const withoutTrailingSlashesInUrlsInJson = removeTrailingSlashesInUrlsInJSON(withoutHostnamesInAbsoluteUrlsInJson)

    const filesProxied = addFileProxy(withoutTrailingSlashesInUrlsInJson);
    return filesProxied
}

export const removeHostnameInAbsoluteUrls = (html: string): string => {
	return html
        .replaceAll(`href=\"${BASE_URL}`, `href=\"`)
}

export const removeTrailingSlashesInURLS = (html: string): string => {
    return html
        .replaceAll(/href=\\"\\\/(.*?)\"/g, (subString) => subString.replace('\\/\\"', '\\"'))
}

export const removeHostNameInAbsoluteUrlsInJSON = (json: string): string => {
    return json.replaceAll(`"url":"${BASE_URL}`, `"url": "`)
}

export const removeTrailingSlashesInUrlsInJSON = (json: string): string => {
    return json.replaceAll(/"url":"\\\/(.*?)"/g, subString => {
        return subString.replace(`\\/"`, `"`)
    })
}

export const addFileProxy = (json: string): string => {
    //TODO: replace PDF links as well
    const files = new RegExp(`https:\\\\/\\\\/${HOSTNAME}\\\\/wp-content.*?(svg|png|jpg|pdf)`, 'g')
    const uploads = new RegExp(`https:.*?${HOSTNAME}.*?wp-content.*?uploads`, 'g')


    const jsonOutput = json
        .replaceAll(files, 
            substring => {
                // return substring
                return substring.replace(uploads, `\/assets`)
            }
        )

    try {
        JSON.parse(jsonOutput)
        return jsonOutput
    } catch (err) {
        return json
    }
}