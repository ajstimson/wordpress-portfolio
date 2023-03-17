import { CMSComponent } from "../types"

export type ResourceRaw = {

    background: {
        url: string
    }

    title: string
    resource: ResourceItemRaw[]

}

// TODO: refactor to match below (this is a union type which is more explicit)
// type ResourceItemRaw = ResourceItemVideoRaw | ResourceItemPDFRaw

export type ResourceItemRaw = {
    resource_title: string
    text: string
    link: string
    external_link?: {
        title: string
        url: string
        target: string
    }
    audio_type: string
    audio_link?: {
        title: string
        url: string
        target: string
    }
    video_link?: string | null
    upload_file?: {
        url?: string
        mime_type?: string
    }
}

export type ResourceItemProps = {
    item_title: string
    text: string
    link_data: {
        link_type: string
        url: string
        audio_type: string
        mime_type?: string
        target?: string
    }
}

export interface ResourceProps extends CMSComponent {
    background: string
    title: string;
    resource: ResourceItemProps[]
}
