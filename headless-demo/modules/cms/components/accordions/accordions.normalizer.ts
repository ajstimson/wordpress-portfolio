
import { AccordionsRaw, AccordionProps, AccordionItemProps } from './accordions.type'

export const normalizeAccordion = (raw: AccordionsRaw): AccordionProps => {    
    return {
        type: 'Accordion',
        title: raw.title,
        accordion: raw.item.map<AccordionItemProps>(rawAccordion => {
            return{
                title: rawAccordion.title,
                html: rawAccordion.html
            }
        }),
    }
};
