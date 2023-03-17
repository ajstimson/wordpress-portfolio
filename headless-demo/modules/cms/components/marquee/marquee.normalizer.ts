import { PageMeta } from '../../types'
import { MarqueeRaw, MarqueeProps } from './marquee.type'

export const normalizeMarquee = (raw: MarqueeRaw, meta: PageMeta): MarqueeProps => {
    // console.log(JSON.stringify(raw))
    return {
        type: 'Marquee',
        template: meta.template,
        image: {
            name: raw.image.name,
            url: raw.image.url
        },
        buttons: raw.buttons ? raw.buttons.map(x => x.button) : [],
        text: raw.html,
        title: raw.title
    }
}
