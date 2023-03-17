import { CMSComponent } from "../types"

export type ColumnsRaw = {
    title: string
    column: {
        image: {
            url: string
            alt: string
        }
        link: {
            title: string
            url: string
            target: string
        }
        text: string
    }[]
}


export type ColumnProps = {
    image: {
        url: string
        alt: string
    }
    link: {
        title: string
        url: string
        target: string
    }
    text: string
}

export interface ColumnsProps extends CMSComponent {
    title: string
    column: ColumnProps[] | any
}
