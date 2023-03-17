import { StaffRaw, StaffDetails, StaffProps } from './staff.type'

export const normalizeStaff = ({ staff, title }: StaffRaw): StaffProps => {    
    return {
        type: 'Staff',
        title,
        staff: staff.map<StaffDetails>(rawStaff=> {
            return{
                status: rawStaff.status,
                name: rawStaff.title.rendered,
                title: rawStaff.acf.title,
                image: rawStaff.acf.image ? rawStaff.acf.image : undefined,
                phone: rawStaff.acf.phone,
                email: rawStaff.acf.email,
            }
        }),
    }
}
