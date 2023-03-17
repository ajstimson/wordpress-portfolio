import { ContentRaw, ContentProps } from './no-format-content.type'

export const normalizeNoFormatContent = (raw: ContentRaw): ContentProps => {
    return {
        type: 'NFContent',
        title: raw.title.rendered,
        html: raw.content.rendered
    }
}
