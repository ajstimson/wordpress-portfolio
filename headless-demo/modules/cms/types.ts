import { CMSComponent } from "./components/types"

type MetaProperty = { property: string, content: string }
type MetaNamedProperty = { name: string, content: string }
// user defined guards
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards

export const isMetaProperty = (meta: MetaProperty | MetaNamedProperty): meta is MetaProperty => {
    return (meta as MetaProperty).property !== undefined;
}

export const isNamedMetaProperty = (meta: MetaProperty | MetaNamedProperty): meta is MetaNamedProperty => {
    return (meta as MetaNamedProperty).name !== undefined;
}

export type PageRaw = {
    yoast_head_json: MetaRaw
    // yoast_meta: (MetaProperty | MetaNamedProperty)[] // union type
    yoast_title: string
    title: {
        rendered: string
    },
    link: string,
    template: string
}

export type MetaRaw = {
    title: string,
    description: string,
    robots: {
        index: string
        follow: string
        ["max-snippet"]: string
        ["max-image-preview"]: string
        ["max-video-preview"]: string
    },
    og_locale: string
    og_type: string
    og_title: string,
    og_description: string,
    og_url: string,
    og_site_name: string
}

export type PageBreadcrumb = {
    name: string
    url: string
    slug: string
}

export type PageMeta = {
    title: string
    pageTitle: string
    properties: MetaProperties
    // properties: MetaProperty[]
    // namedProperties: MetaNamedProperty[]
    template: string
    path: string
    breadcrumbs: PageBreadcrumb[]
}

export type MetaProperties = {
    title: string,
    description: string,
    robots: {
        index: string
        follow: string
        max_snippet: string
        max_image_preview: string
        max_video_preview: string
    },
    og_locale: string
    og_type: string
    og_title: string,
    og_description: string,
    og_url: string,
    og_site_name: string
}

export type Page = {
    meta: PageMeta,
    components: CMSComponent[]
}

export type Post = {
    data: any
}

// default export
// export default function()
// => import foo from './path/to/file'
// can only have 1
// const foo = = 3
// export default foo

// named export
// => import { name } from './path/to/file'
// can have multiple


// under the hood
// default export
// module.default = myFunction
// module.exports = { myOtherFunction, myOtherOtherFunction }