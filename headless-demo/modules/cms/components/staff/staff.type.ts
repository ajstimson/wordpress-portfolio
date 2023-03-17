import { CMSComponent } from "../types"

export interface StaffRaw {
    title: string
    staff: StaffRawDetails[]
}

export interface StaffRawDetails {
    acf: {
        title: string;
        image: {
            url: string
            alt: string
        } | false;
        phone: string;
        email: string;
    }
    status: string
    title: {
        rendered: string
    }
}

// export type StaffRaw = StaffDetailsRaw []

export interface StaffDetails {
    status: string
    name: string
    title: string
    image?: {
        url: string
        alt: string
    }
    phone: string
    email: string
}

export interface StaffProps extends CMSComponent {
    title: string
    staff: StaffDetails[]
}
