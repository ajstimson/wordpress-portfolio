import { CMSComponent } from "../types"

export type TextRaw = {
    html: string
}

export interface TextProps extends CMSComponent {
    html: string
}