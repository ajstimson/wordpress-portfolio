import { CMSComponent } from "../types"

export type ContentRaw = {
    
    title: {
        rendered: string
    }
    content: {
        rendered: string
    }
}

export interface ContentProps extends CMSComponent {
    title: string
    html: string
}