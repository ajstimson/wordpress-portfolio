// generic type parameter <SomeType> 
// const foo = [1,2,3].map<string>(x => x.toString())
// const foo2 = [1,2,3].map<number>(x => x * 2)

import { ColumnsRaw, ColumnsProps, ColumnProps } from './columns.type'

export const normalizeColumns = (raw: ColumnsRaw): ColumnsProps => {    
    return {
        type: 'Columns',
        title: raw.title,
        column: raw.column.map<ColumnProps>(rawColumn => {
            return{
                image: {
                    url: rawColumn.image.url,
                    alt: rawColumn.image.alt
                },
                link: {
                    title: rawColumn.link.title,
                    url: rawColumn.link.url,
                    target:rawColumn.link.target
                },
                text: rawColumn.text
            }
        }),
    }
};
