import { CMSComponent } from "../types"

export type AccordionsRaw = {
    acf_fc_layout: string
    title: string
    item: {
        title: string
        html: string
    }[]
}


export type AccordionItemProps = {
    title: string
    html: string
}

export interface AccordionProps extends CMSComponent {
    title: string
    accordion: AccordionItemProps[]
}
