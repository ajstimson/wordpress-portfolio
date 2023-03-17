import { CMSComponent } from "../types";

export type IntroImageRaw = {
  url: string;
  alt: string;
};

export type CustomSidebarRow = {
  link_type: string;
  media: SidebarMediaLink;
  link: {
    title: string;
    url: string;
    target: string;
  }
}

export type IntroSideBarRaw = {
  sidebar_type: string;
  global_sidebar: {
    title: string;
    post_object: {
      acf: {
        sidebar: GlobalSidebarContentRaw[];
      };
    };
  };
  custom_sidebar: {
    title: string;
    sidebar_links: false
      | CustomSidebarRow[];
  };
};

export type GlobalSidebarContentRaw = {
  html: string;
  standalone_link: {
    title: string;
    url: string;
    target: string;
  };
};

export type SidebarMediaLink = {
  text: string;
  media: { url: string; };
};

export type IntroRaw = {
  acf_fc_layout: string;
  intro: string;
  signature_selection: boolean;
  signature_content: {
    headshot: IntroImageRaw | false;
    salutation: string;
    signature_image: IntroImageRaw | false;
    name_title: string;
  };
  sidebars: IntroSideBarRaw[];
};

export type IntroImageProps = {
  url: string;
  alt: string;
};

export type IntroSignatureProps = {
  salutation: string;
  name: string;
  headshot?: IntroImageProps;
  signatureImage?: IntroImageProps;
};

export type IntroSidebarProps = {
  sidebarType: string;
  title: string;
  content?: GlobalSidebarProps[];
  links?: SidebarLinkProps[];
};

export type GlobalSidebarProps = {
  html: string;
  standalone_link: {
    title: string;
    url: string;
    target: string;
  };
};

export type SidebarLinkProps = {
  text?: string;
  url?: string;
  target?: string;
};

export interface IntroProps extends CMSComponent {
  html: string;
  signature?: IntroSignatureProps;
  sidebars?: IntroSidebarProps[];
}
