import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { CalendarRaw, CalendarProps } from './calendar.type'

export const normalizeCalendar = (raw: CalendarRaw): CalendarProps =>{
    return {
        type: 'Calendar',
        url: raw.calendar.url,
        alt: raw.calendar.description
    }
}