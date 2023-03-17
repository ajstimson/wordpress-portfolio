// generic type parameter <SomeType> 
// const foo = [1,2,3].map<string>(x => x.toString())
// const foo2 = [1,2,3].map<number>(x => x * 2)

import { CardsRaw, CardsProps, OrnamentProps, CardProps } from './cards.type'

export const normalizeCards = (raw: CardsRaw): CardsProps => { 
    return {
        type: 'Cards',
        background: raw.background.url,
        title: raw.title,
        ornaments: raw.Ornaments ? raw.Ornaments.map<OrnamentProps>(rawOrnament => {
            return {
                alt: rawOrnament.image.alt,
                url: rawOrnament.image.url
            }
        }) : undefined, 
        cards: raw.card.map<CardProps>(rawCard => {
            
            return{
                image: {
                    url: rawCard.image.url,
                    alt: rawCard.image.alt
                },
                title: rawCard.title,
                text: rawCard.text,
                link:  {
                    title: rawCard.link.title,
                    url: rawCard.link.url,
                    target: rawCard.link.target
                }
            }
        }),

    }
}
