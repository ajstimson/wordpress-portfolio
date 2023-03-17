import { CMSComponent } from "../types"

export type BrandStatementRaw = {
    title: string
    html: string
}

export interface BrandStatementProps extends CMSComponent {
    title: string
    html: string
}
