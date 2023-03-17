import { FAQRaw, FAQItemProps, FAQProps } from './faq.type'

export const normalizeFAQ = (raw: FAQRaw[]): FAQProps => {  

    return {
        type: 'FAQ',
        title: raw[0]?.sectionTitle,
        faqs: raw.map<FAQItemProps>(rawFAQ=> {
            return{
                question: rawFAQ.title.rendered,
                answer: rawFAQ.acf.answer
            }
        }),
    }
}
