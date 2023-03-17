import { url } from 'inspector'
import { TabsRaw, TabItemProps, TabsProps } from './tabs.type'

export const normalizeTabs = (raw: TabsRaw): TabsProps => {    
    return {
        type: 'Tabs',
        tabs: raw.tab.map<TabItemProps>(rawTab => {
            return{
                name: rawTab.name,
                section_header: rawTab.section_header,
                html: rawTab.html,
                standalone_cta_link: {
                    url: rawTab.standalone_cta_link ? rawTab.standalone_cta_link.url : undefined,
                    text: rawTab.standalone_cta_link ? rawTab.standalone_cta_link.text : undefined,
                    target: rawTab.standalone_cta_link? rawTab.standalone_cta_link.target : undefined
                },
                image: {
                    url: rawTab.image ? rawTab.image.url : undefined,
                    alt: rawTab.image ? rawTab.image.alt : undefined,
                }
            }
        }),
    }
}
