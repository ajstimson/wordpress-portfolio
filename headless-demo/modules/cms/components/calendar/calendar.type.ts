import { CMSComponent } from "../types"

export type CalendarRaw = {
    calendar: {
        url: string
        description: string
    }
}

export interface CalendarProps extends CMSComponent {
    url: string
    alt: string
}