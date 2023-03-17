import { rawListeners } from "process";
import {
  IntroRaw,
  IntroProps,
  IntroSignatureProps,
  IntroSidebarProps,
  SidebarLinkProps,
  SidebarMediaLink,
  IntroImageRaw,
  IntroImageProps,
  GlobalSidebarContentRaw,
  GlobalSidebarProps,
  IntroSideBarRaw,
  CustomSidebarRow
} from "./intro-section.type";

const normalizeImage = ({ url, alt }: IntroImageRaw): IntroImageProps => ({
  url,
  alt,
});

const normalizeSidebar = (sidebars: IntroSideBarRaw[]): IntroSidebarProps[] => {
  const mappedSidebars = sidebars.map((rawSidebar) => {
    const sidebarTitle =
      rawSidebar.global_sidebar.title || rawSidebar.custom_sidebar.title;

    const globalContent =
      rawSidebar.global_sidebar?.post_object?.acf?.sidebar.map((sidebar) => ({
        html: sidebar.html,
        standalone_link: {
          title: sidebar.standalone_link.title,
          url: sidebar.standalone_link.url,
          target: sidebar.standalone_link.target,
        },
      }));

      const sidebarLinks = rawSidebar.custom_sidebar.sidebar_links
      ? rawSidebar.custom_sidebar.sidebar_links.map(
          (rawLinks) => {
            if (rawLinks.link !== null){
              return {
                text: rawLinks.link.title || rawLinks.media.text,
                url: rawLinks.link.url || rawLinks.media.media?.url,
                target: rawLinks.link.target || '_self'
              }
            } else {
              return {};
            }
          }
        )

      : undefined;    

      const output = {
        sidebarType: rawSidebar.sidebar_type,
        title: sidebarTitle,
        content: globalContent,
        links: sidebarLinks,
      }
      
      return output;
  });

  return mappedSidebars;
};

export const normalizeIntro = (raw: IntroRaw): IntroProps => {
  return {
    type: "Intro",
    html: raw.intro,
    signature: raw.signature_selection
      ? {
          headshot: raw.signature_content.headshot
            ? normalizeImage(raw.signature_content.headshot)
            : undefined,
          salutation: raw.signature_content.salutation,
          signatureImage: raw.signature_content.signature_image
            ? normalizeImage(raw.signature_content.signature_image)
            : undefined,
          name: raw.signature_content.name_title,
        }
      : undefined,
    sidebars:
      raw.sidebars.length > 0 ? normalizeSidebar(raw.sidebars) : undefined,
  };
};
