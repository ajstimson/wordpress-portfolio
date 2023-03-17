import { ImageTextRaw, MixedTypeProps, ImageTextProps } from './image-text.type'

export const normalizeImageText = (raw: ImageTextRaw): ImageTextProps => {
    return {
        type: 'ImageText',
        mixed_content: raw.image_and_text.map<MixedTypeProps>(rawMix => {
            return {
                layout: rawMix.acf_fc_layout,
                content: rawMix.content ? rawMix.content.text : undefined,
                image: {
                    url: rawMix.image ? rawMix.image.url : undefined,
                    alt: rawMix.image ? rawMix.image.alt : undefined
                }
           
        }}),
        
    }
}
