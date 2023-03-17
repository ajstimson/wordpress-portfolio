// generic type parameter <SomeType> 
// const foo = [1,2,3].map<string>(x => x.toString())
// const foo2 = [1,2,3].map<number>(x => x * 2)

import { ResourceRaw, ResourceItemRaw, ResourceProps, ResourceItemProps } from './resources.type'

export const normalizeResources = (raw: ResourceRaw): ResourceProps => { 
    return {
        type: 'Resources',
        title: raw.title,
        background: raw.background.url,
        resource: raw.resource.map<ResourceItemProps>(rawItem => {
            return{
                item_title: rawItem.resource_title,
                text: rawItem.text,
                link_data: {
                    link_type: rawItem.link,
                    url: rawItem.audio_link?.url || rawItem.external_link?.url || rawItem.video_link || rawItem.upload_file?.url || null,
                    audio_type: rawItem.audio_type || null,
                    mime_type: rawItem.upload_file.mime_type,
                    target: rawItem.audio_link?.target || rawItem.external_link?.target || null,
                }   
            }
        }),

    }
}
