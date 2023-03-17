export type FooterRaw = {
    id: number,
    date: string,
    // ...
    content: {
        rendered: string,
        protected: boolean
    }
    acf: any
  }

  export type FooterData = { 
    logo: any
    main_content: any
    main_background: any
    social: any
    statement: any
    subFooterList: any
    subFooterStatement: any
    utility_statement: any
    data: any
  }