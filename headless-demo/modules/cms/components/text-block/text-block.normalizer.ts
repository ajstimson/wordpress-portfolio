import { TextRaw, TextProps } from './text-block.type'

export const normalizeText = (raw: TextRaw): TextProps => {
    return {
        type: 'Text',
        html: raw.html
    }
}
