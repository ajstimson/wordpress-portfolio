import { CMSComponent } from "../types";

export type ContentRowSideBarRaw = {
  sidebar_type: string;
  global_sidebar: {
    title: string;
    post_object: {
      acf: {
        sidebar: IconSidebarRaw[] | CTASidebarRaw[]
      };
    };
  };
  custom_sidebar: {
    title: string;
    sidebar_links:
      | {
          link_type: string;
          media: SidebarMediaLink;
          link: {
            title: string;
            url: string;
            target: string;
          };
        }[]
      | false;
  };
};

export type IconSidebarRaw = {
  icon_sidebar:{
    image: {
        url: string
        alt: string
    }
    link: {
        url: string
        title: string
        target: string
    }
  }[]
};

export type CTASidebarRaw = {
  acf_fc_layout: string
  title: string
  html: string
  standalone_link: {
    title: string
    url: string
    target: string
  }
}

export type ContentRaw = {
  acf_fc_layout: string;
  content: string | undefined;
  image:
    | {
        url: string;
        alt: string;
      }
    | undefined;
};

export type ContentRowRaw = {
  acf_fc_layout: string;
  content: ContentRaw[];
  sidebars: ContentRowSideBarRaw[];
};

export type ContentRowSidebarProps = {
  sidebarType: string;
  title: string;
  icon_content?: IconSidebarProps[]
  cta_content?: CTASidebarProps[]
  links?: SidebarLinkProps[]
};

export type IconSidebarProps = {
    image: {
        url: string
        alt: string
    }
    link: {
        url: string
        title: string
        target: string
    }
};

export type CTASidebarProps = {
  title: string
  content: string
  link: {
    title: string
    url: string
    target: string
  }
}

export type SidebarMediaLink = {
  text: string;
  media: { url: string; }
};

export type SidebarLinkProps = {
  text: string;
  url: string;
  target: string;
};

export type ContentProps = {
  html?: string;
  image?: {
    url: string;
    alt: string;
  };
};

export interface ContentRowProps extends CMSComponent {
  content: ContentProps[];
  sidebars?: ContentRowSidebarProps[];
}
