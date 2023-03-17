import {
    CMSComponent
} from "../types"

export type NewsSidebarRaw = {
    posts: PostsContentRaw[]
    more_news_link: {
        title: string
        url: string
        target: string
    }
    sidebars: SidebarsRaw[]
}

export type PostsContentRaw = {
    post: {
        post_title: string
        post_content: string
    }
}

export type SidebarsRaw = {
    sidebar: {
        title: string
        link: {
            title: string
            url: string
            target: string
        }
    }
}

export type PostsProps = {
    title: string
    excerpt: string
}

export type SidebarProps = {
    title: string
    link: {
        title: string
        url: string
        target: string
    }
}

export interface NewsSidebarProps extends CMSComponent {
    posts: PostsProps[]
    more_news_link: {
        title: string
        url: string
        target: string
    }
    sidebars: SidebarProps[]
}