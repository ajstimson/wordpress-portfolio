import {
  PageRaw,
  Page,
  isMetaProperty,
  isNamedMetaProperty,
  PageMeta,
  PageBreadcrumb,
} from "../types";

// TODO: actual URL
const BASE_URL = "http://localhost:3000";

const capitalize = (str: string): string =>
  `${str[0].toUpperCase()}${str.substring(1)}`;

const capitalizeSlug = (str: string): string =>
  str.split("-").map(capitalize).join(" ");

const normalizeBreadcrumbs = (pathname: string): PageBreadcrumb[] => {
  // remove leading and trailing slashes then split on remaining slashes
  const split = pathname.replace(/^\//, "").replace(/\/$/, "").split("/");

  const breadcrumbs: { slug: string; url: string; name: string }[] = [];
  for (let i = 0; i < split.length; i++) {
    const previousURLComponents = i > 0 ? breadcrumbs.slice(0, i) : [];

    const urlPrefix = previousURLComponents.map((x) => x.url).join();

    const slug = split[i];
    const url = `${urlPrefix}/${slug}`;
    
    if (slug.length > 0){
      const name = capitalizeSlug(slug);
  
      breadcrumbs.push({
        slug,
        url,
        name,
      });
    }
  }

  return [
    {
      slug: "",
      name: "Home",
      url: "/",
    },
    ...breadcrumbs,
  ];
};

export const normalizeMeta = (json: PageRaw): PageMeta => {
  const { pathname } = new URL(json.link);

  return {
    title: json.yoast_title,
    pageTitle: json.title.rendered,
    properties: {
      title: json.yoast_head_json.title,
      description: json.yoast_head_json.description,
      robots: {
          index: json.yoast_head_json.robots.index,
          follow: json.yoast_head_json.robots.follow,
          max_snippet: json.yoast_head_json.robots["max-snippet"],
          max_image_preview: json.yoast_head_json.robots["max-image-preview"],
          max_video_preview: json.yoast_head_json.robots["max-video-preview"]
      },
      og_locale: json.yoast_head_json.og_locale,
      og_type: json.yoast_head_json.og_type,
      og_title: json.yoast_head_json.title,
      og_description: json.yoast_head_json.og_description,
      og_url: json.yoast_head_json.og_url,
      og_site_name: json.yoast_head_json.og_site_name
    },
    // properties: json.yoast_meta.filter(isMetaProperty),
    // namedProperties: json.yoast_meta.filter(isNamedMetaProperty),
    template: json.template.split(".")[0],
    path: pathname.replace(/\/$/, ""),
    breadcrumbs: normalizeBreadcrumbs(pathname),
  };
};
