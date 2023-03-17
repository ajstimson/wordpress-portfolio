import { CMSComponent } from "../types"

export type TabsRaw = {
    tab: {
        name: string
        section_header: string
        html: string
        standalone_cta_link: {
            url: string
            text: string
            target: string
        }
        image:{
            url?: string
            alt?: string
        }
    }[]
}

export type TabItemProps = {
    name: string
    section_header: string
    html: string
    standalone_cta_link: {
        url: string
        text: string
        target: string
    }
    image: {
        url?: string
        alt?: string
    }
}

export interface TabsProps extends CMSComponent {
    tabs: TabItemProps[]
}
