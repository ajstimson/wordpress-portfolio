import { CMSComponent } from "../types"
import type { NextApiRequest, NextApiResponse } from 'next'

export type MarqueeRaw = {
    image: {
        url: string;
        name: string;
    }
    title: string;
    html: string;
    buttons: false | {
        button: {
            title: string;
            url: string;
            target: string            
        }
    }[]
    
}

export type MarqueeButtonProps = {
    title: string;
    target: string;
    url: string;
}

export interface MarqueeProps extends CMSComponent {
    template: string;
    title: string;
    text: string;
    image: {
        url: string;
        name: string;
    }
    buttons: MarqueeButtonProps[]
}