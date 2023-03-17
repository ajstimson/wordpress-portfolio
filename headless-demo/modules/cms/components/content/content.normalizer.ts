import { ContentRaw, ContentProps } from './content.type'

export const normalizeContent = (raw: ContentRaw): ContentProps => {
    return {
        type: 'Content',
        title: raw.title,
        html: raw.html
    }
}
