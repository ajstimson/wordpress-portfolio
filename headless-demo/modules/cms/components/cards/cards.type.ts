import { CMSComponent } from "../types"

export type CardsRaw = {

    background: {
        url: string
    }

    title: string

    Ornaments: false | {
        image: {
            url: string
            alt: string
        }
    }[]
    
    card: CardItemRaw[]

}

export type CardItemRaw = {
    image:{
        url: string
        alt: string
    }
    title: string
    text: string
    link:  {
        title: string
        url: string
        target: string
    }
}

export type OrnamentProps = {
    url: string
    alt: string
}

export type CardProps = {
    image: {
        url: string
        alt: string
    }
    title: string
    text: string
    link: {
        title: string
        url: string
        target: string
    }
}

export interface CardsProps extends CMSComponent {
    background: string
    ornaments: OrnamentProps[]
    title: string;
    cards: CardProps[]
}
