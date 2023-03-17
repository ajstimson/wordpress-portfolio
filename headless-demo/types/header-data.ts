export type HeaderRaw = {
    id: number
    acf: {
      utility_header: {
        google_translate: string
        contact_info: string
        list_items: [] | false
      }
      main_header: {
        logo: {
          url: string
          alt: string
        }
        navigation_menu: string
        enroll_button: {
          title: string
          url: string
          target: string
        }
        request_info_button: {
          title: string
          url: string
          target: string
        }
      }
    }
  }

  export type HeaderProps = { 
    utility_header: {
      google_translate: string
      contact_info: string
    }
    logo: {
      url: string
      alt: string
    }
    nav_menu: string
    enroll_button: {
      title: string
      url: string
      target: string
    }
    request_info_button: {
      title: string
      url: string
      target: string
    }
  }