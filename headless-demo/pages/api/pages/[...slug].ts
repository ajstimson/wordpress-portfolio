import type { NextApiRequest, NextApiResponse } from "next";
import {flatten} from 'lodash';
import fetch from "node-fetch"; // in node fetch is exported as default
import { components, normalizers } from "../../../modules/cms/components"; // it was exported as name
import { CMSComponent } from "../../../modules/cms/components/types";
import { normalizeMeta } from "../../../modules/cms/normalizers/normalize-meta";
import { normalizeUrls } from "../../../modules/cms/normalizers/normalize-urls";
import { Page } from "../../../modules/cms/types";
import {
  // look up in lodash docs to see usage of this
  uniqBy,
  // use to sort
  sortBy,
  // for convenience
  chain,
} from "lodash";
import { WORDPRESS_URL } from "../../../modules/cms/config/config";
import { preProcessResponse } from "../../../modules/cms/utils/pre-process-response";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const URL = `${WORDPRESS_URL}/pages?slug=${req.query.slug}`
  const response = await fetch(URL);
  const json = await preProcessResponse(response)

  if (!json.length) {
    res.status(500).send("Internal Server Error");
    return;
  }

  const pageRaw = json[0];

  const meta = normalizeMeta(pageRaw);

  let components: CMSComponent[] = [];

  if (pageRaw.template) {
    const perPage = 47

    const normalized = await Promise.all(
      pageRaw.acf.components.map(async (value) => {
        const name = value.acf_fc_layout;

        if (name === "staff_faculty") {
          if (value.staff_faculty_tags.length < 1) {
            return null;
          }

         
          const tagsFromComponent = value.staff_faculty_tags.map(
            (x) => x.term_id
          );

         
          const staffBaseUrl = `${WORDPRESS_URL}/team?per_page=${perPage}`;

          const staffResponse = await fetch(staffBaseUrl);
          const staffJson = await preProcessResponse(staffResponse);
          const totalPages = Number(
            staffResponse.headers.get("x-wp-totalpages")
          );

          
          const otherResponses = await Promise.all(
            [...Array(totalPages - 1)].map(async (_, index) => {
              const response = await fetch(
                `${staffBaseUrl}&offset=${perPage * (index + 1)}`
              );
              const json = await  preProcessResponse(response)
              return json
            })
          );

          const fullJson = [...staffJson, ...otherResponses].flat()
          const title = value.title

          value = {
            title,
            staff: chain(fullJson)
            .filter((staff) =>
              ((staff.acf?.tags || []) as any[])
                .map((tag) => tag.term_id)
                .some((term) => tagsFromComponent.includes(term))
            )
            .uniqBy((x) => x.id) // fix this line
            .sortBy((x) => x.title.rendered.split(' ').pop()) // fix this line
            .value()
          };          

        } else if (name === "faq_section") {
          if (value.faq_tags.length < 1) {
            return null;
          }

          const title = value.title;

          const tagsFromComponent = value.faq_tags.map((x) => x.term_id);

          const faqResponse = await fetch(`${WORDPRESS_URL}/faq?per_page=${perPage}`)
          const faqJson = await preProcessResponse(faqResponse)

          value = faqJson
            .filter((faqs) =>
              (faqs.acf.tags as any[])
                .map((tag) => tag.term_id)
                .some((term) => tagsFromComponent.includes(term))
            )
            .map((faq) => ({ ...faq, sectionTitle: title }));

        }

        const normalizer = normalizers[name];

        if (normalizer) {
          return normalizer(value, meta);
        }

        return null;
      })
    );

    components = normalized.filter((x) => x !== null) as CMSComponent[];
  } else {
    // page without template
    const title = pageRaw.title.rendered;
    const {
      content: { rendered: html },
    } = pageRaw;

    components = [
      {
        type: "FreeText",
        title,
        html,
      } as CMSComponent,
    ];
  }

  const result: Page = {
    meta,
    components,
  };

  res.status(200).json(result);
};
