import { icon } from "@fortawesome/fontawesome-svg-core";
import { rawListeners } from "process";
import {flatten} from 'lodash';
import {
  ContentRowRaw,
  ContentRaw,
  ContentRowSideBarRaw,
  ContentRowSidebarProps,
  ContentProps,
  SidebarLinkProps,
  ContentRowProps,
} from "./content-row-sidebar.type";

const normalizeSidebar = (
  sidebars: ContentRowSideBarRaw[]
): ContentRowSidebarProps[] => {
  const mappedSidebars = sidebars.map((rawSidebar) => {
    const sidebarTitle =
      rawSidebar.global_sidebar.title || rawSidebar.custom_sidebar.title;

    const iconSidebarContent =
      rawSidebar.global_sidebar?.post_object?.acf?.sidebar?.map((sidebar) => {
        if (sidebar.icon_sidebar !== undefined){
          return sidebar.icon_sidebar.map((iconSidebar) => ({
            image: {
              url: iconSidebar.image.url,
              alt: iconSidebar.image.alt,
            },
            link: {
              url: iconSidebar.link.url,
              title: iconSidebar.link.title,
              target: iconSidebar.link.target,
            },
          }));
        } else {
          return null;
        }
      });
    
    const ctaSidebarContent = 
      rawSidebar.global_sidebar?.post_object?.acf?.sidebar?.map((rawSidebar) => {
        if (rawSidebar.acf_fc_layout !== undefined && rawSidebar.acf_fc_layout === 'cta'){
          return {
            title: rawSidebar.title,
            content: rawSidebar.html,
            link: {
              title: rawSidebar.standalone_link.title,
              url: rawSidebar.standalone_link.url,
              target: rawSidebar.standalone_link.target
            }
          }
        } else {
          return null;
        }
      })


    const sidebarLinks = rawSidebar.custom_sidebar.sidebar_links
      ? rawSidebar.custom_sidebar.sidebar_links.map<SidebarLinkProps>(
          (rawLinks) => {
            return {
              text: rawLinks.link.title || rawLinks.media.text,
              url: rawLinks.link.url || rawLinks.media.media?.url,
              target: rawLinks.link.target || "_self",
            };
          }
        )
      : undefined;

    const output = {
      sidebarType: rawSidebar.sidebar_type,
      title: sidebarTitle,
      icon_content: flatten(iconSidebarContent),
      cta_content: ctaSidebarContent,
      links: sidebarLinks,
    };
    return output;
  });

  return mappedSidebars;
};

export const normalizeContentRow = (raw: ContentRowRaw): ContentRowProps => {
  return {
    type: "ContentRow",
    content: raw.content.map<ContentProps>((rawContent) => {
      return {
        html: rawContent.content,
      };
    }),
    sidebars:
      raw.sidebars.length > 0 ? normalizeSidebar(raw.sidebars) : undefined,
  };
};
