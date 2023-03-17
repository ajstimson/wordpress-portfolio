//Barrel

import { normalizeMarquee } from './marquee/marquee.normalizer'
import { MarqueeComponent } from './marquee/marquee.component'
import { normalizeBrandStatement } from './brand-statement/brand-statement.normalizer'
import { BrandStatementComponent } from './brand-statement/brand-statement.component'
import { normalizeCards } from './cards/cards.normalizer'
import { CardsComponent } from './cards/cards.component'
import { normalizeImageText } from './image-text/image-text.normalizer'
import { ImageTextComponent } from './image-text/image-text.component'
import { IntroComponent } from './intro-section/intro-section.component'
import { normalizeIntro } from './intro-section/intro-section.normalizer'
import { ColumnsComponent } from './columns/columns.component'
import { normalizeColumns } from './columns/columns.normalizer'
import { normalizeContentRow } from './content-row-sidebar/content-row-sidebar.normalizer'
import { ContentRowComponent } from './content-row-sidebar/content-row-sidebar.component'
import { normalizeAccordion } from './accordions/accordions.normalizer'
import { AccordionComponent } from './accordions/accordions.component'
import { normalizeStaff } from './staff/staff.normalizer'
import { StaffComponent } from './staff/staff.component'
import { normalizeContent } from './content/content.normalizer'
import { ContentComponent } from './content/content.component'
import { normalizeTabs } from './tabs/tabs.normalizer'
import { TabsComponent } from './tabs/tabs.component'
import { normalizeText } from './text-block/text-block.normalizer'
import { TextComponent } from './text-block/text-block.component'
import { normalizeFAQ } from './faq/faq.normalizer'
import { FAQComponent } from './faq/faq.component'
import { normalizeForm } from './form/form.normalizer'
import { FormComponent } from './form/form.component'
import { normalizeNewsSidebar } from './news-sidebar/news-sidebar.normalizer'
import { NewsSidebarComponent } from './news-sidebar/news-sidebar.component'
import { normalizeNoFormatContent } from './no-format-content/no-format-content.normalizer'
import { NoFormatContentComponent } from './no-format-content/no-format-content.component'
import { normalizeResources } from './resources/resources.normalizer'
import { ResourcesComponent } from './resources/resources.component'
// import {normalizeCalendar} from './calendar/calendar.normalizer'
// import {CalendarComponent} from './calendar/calendar.component'

export const normalizers = {
    marquee: normalizeMarquee,
    brand_statement: normalizeBrandStatement,
    // calendar: normalizeCalendar,
    cards: normalizeCards,
    image_text: normalizeImageText,
    intro_section: normalizeIntro,
    columns: normalizeColumns,
    content_row_sidebar: normalizeContentRow,
    accordions: normalizeAccordion,
    staff_faculty: normalizeStaff,
    content: normalizeContent,
    tabs: normalizeTabs,
    text_block: normalizeText,
    faq_section: normalizeFAQ,
    forms: normalizeForm,
    news_sidebar: normalizeNewsSidebar,
    resources: normalizeResources
}

export const components = {
    Marquee: MarqueeComponent,
    BrandStatement: BrandStatementComponent,
    // Calendar: CalendarComponent,
    Cards: CardsComponent,
    ImageText: ImageTextComponent,
    Intro: IntroComponent,
    Columns: ColumnsComponent,
    ContentRow: ContentRowComponent,
    Accordion: AccordionComponent,
    Staff: StaffComponent,
    Content: ContentComponent,
    Resources: ResourcesComponent,
    Tabs: TabsComponent,
    Text: TextComponent,
    FAQ: FAQComponent,
    Form: FormComponent,
    NewsSidebar: NewsSidebarComponent,
    FreeText: NoFormatContentComponent
}