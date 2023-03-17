import { Page } from '../types'

export const getPage = async (endpoint: string, slug: string): Promise<Page> => {
  try {
    // return null
    //console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}/${slug}`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}/${slug}`);
    const json = (await response.json()) as Page;
    if (!json) {
      throw new Error("Did not receive data");
    }

    return json;
  } catch (err) {
    console.log(err);
    return null
  }
};

  const response = await fetch(URL)
  const json = await preProcessResponse(response)

  //TODO: uncomment before launch if this is the solution
  // const response = await fetch(`${URL}/pages?slug=${req.query.slug}`,{headers:{authorization:'Basic orvastg:d99e8bfa'}});

  if (!json.length) {
    throw new Error('Did not receive data')
  }

  const pageRaw = json[0]
  const meta = normalizeMeta(pageRaw)
  let components: CMSComponent[] = []

  if (pageRaw.template) {
    const perPage = 47

    const normalized = await Promise.all(
      pageRaw.acf.components.map(async (value) => {
        const name = value.acf_fc_layout

        if (name === 'staff_faculty') {
          if (value.staff_faculty_tags.length < 1) {
            return null
          }

          const tagsFromComponent = value.staff_faculty_tags.map(
            (x) => x.term_id
          )

          const staffBaseUrl = `${CMS_API_URL}/team?per_page=${perPage}`

          const staffResponse = await fetch(staffBaseUrl)
          const staffJson = await preProcessResponse(staffResponse)
          const totalPages = Number(
            staffResponse.headers.get('x-wp-totalpages')
          )

          const otherResponses = await Promise.all(
            [...Array(totalPages - 1)].map(async (_, index) => {
              const response = await fetch(
                `${staffBaseUrl}&offset=${perPage * (index + 1)}`
              )
              const json = await preProcessResponse(response)
              return json
            })
          )

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
              .value(),
          }
        } else if (name === 'faq_section') {
          if (value.faq_tags.length < 1) {
            return null
          }

          const title = value.title

          const tagsFromComponent = value.faq_tags.map((x) => x.term_id)

          const faqResponse = await fetch(
            `${CMS_API_URL}/faq?per_page=${perPage}`
          )
          const faqJson = await preProcessResponse(faqResponse)

          //TODO: Andrew refactor output
          value = faqJson
            .filter((faqs) =>
              (faqs.acf.tags as any[])
                .map((tag) => tag.term_id)
                .some((term) => tagsFromComponent.includes(term))
            )
            .map((faq) => ({ ...faq, sectionTitle: title }))
        } else if (name === 'calendar') {
          value = await fetchCalendars(value)
        }

        const normalizer = normalizers[name]

        if (normalizer) {
          return normalizer(value, meta)
        }

        return null
      })
    )

    components = normalized.filter((x) => x !== null) as CMSComponent[]
  } else {
    // page without template
    const title = pageRaw.title.rendered
    const {
      content: { rendered: html },
    } = pageRaw
    const pageType = pageRaw.type
    //formate date MM/DD/YYYY

    const date = new Date(pageRaw.date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })

    //TODO: if pageType === 'post' then load post component
    components = [
      {
        type: 'FreeText',
        pageType,
        date,
        title,
        html,
      } as CMSComponent,
    ]
  }

  const result: Page = {
    meta,
    components,
  }

  return JSON.parse(JSON.stringify(result))
}
