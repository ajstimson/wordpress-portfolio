import { CMSComponent } from "../types"

export type ContentRaw = {
    
    title: string
    html: string
}

export interface ContentProps extends CMSComponent {
    title: string
    html: string
}