import { CMSComponent } from "../types"

export interface FAQRaw {
    sectionTitle: string;
    title: {
        rendered: string;
    }
    acf: {
        answer: string;
    }
}

export interface FAQItemProps {
    question: string;
    answer: string;
}

export interface FAQProps extends CMSComponent {
    title: string;
    faqs: FAQItemProps[];
}
