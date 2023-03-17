export type BodyRaw = {
    id: number,
    date: string,
    // ...
    content: {
        rendered: string,
        protected: boolean
    }
    acf: any
  }

  export type BodyData = { 
    marquee: any
    marqueeButtons: any
    brand_statement: any
    card_background: any
    card_ornaments: any
    card_title: any
    cards: any
    get_started: any
    get_started_list: any
  }
