import { 
    NewsSidebarRaw, 
    PostsContentRaw, 
    SidebarsRaw,
    PostsProps,
    SidebarProps,
    NewsSidebarProps } from './news-sidebar.type'

export const normalizeNewsSidebar = (raw: NewsSidebarRaw): NewsSidebarProps => { 
    
    return {
        type: 'NewsSidebar',
        posts: raw.posts.map<PostsProps>(rawPost=> {
            return{
                title: rawPost.post.post_title,
                excerpt: rawPost.post.post_content
            }
        }),
        more_news_link: {
            title: raw.more_news_link.title,
            url:raw.more_news_link.url,
            target: raw.more_news_link.target
        },
        sidebars: raw.sidebars.map<SidebarProps>(rawSidebar=> {
            return{
                title: rawSidebar.sidebar.title,
                link: {
                    title: rawSidebar.sidebar.link.title,
                    url: rawSidebar.sidebar.link.url,
                    target: rawSidebar.sidebar.link.target
                }
            }
        })
    }
}
