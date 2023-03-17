import { CMSComponent } from "../types"

export type ImageTextRaw = {
    
    image_and_text: {
        acf_fc_layout: string
        content: {
            text: string
        }
        image:{
            url: string
            alt: string
        }
    }[]
}

export type MixedTypeProps = {
    layout: string,
    content?: string,
    image?: {
        url: string
        alt: string
    }
}

export interface ImageTextProps extends CMSComponent {
    mixed_content: MixedTypeProps[]
}