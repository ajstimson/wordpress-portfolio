import { BrandStatementRaw, BrandStatementProps } from './brand-statement.type'

export const normalizeBrandStatement = (raw: BrandStatementRaw): BrandStatementProps => {
    return {
        type: 'BrandStatement',
        title: raw.title,
        html: raw.html
    }
}
