import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const WORDPRESS_URL = 'https://production.example.com/wp-json/wp/v2'

type MetaData = {
  id: number,
  date: string,
  // ...
  content: {
      rendered: string,
      protected: boolean
  }
}

export const Head = () => {
    const router = useRouter()
    const pageName = router.query.slug?.[0] ?? 'homepage'
    const [data, setData] = useState(null)
    const [err, setError] = useState(null)

    useEffect(() => {
        const getMeta = async () => {
            try {
                const response = await fetch(`${WORDPRESS_URL}/pages?slug=${pageName}`)
                //const response = await fetch(`${WORDPRESS_URL}/pages/6`)
                const json = await response.json() as MetaData[]
                
                if (!json.length) {
                    setError("NOT FOUND")
                    return
                }

            } catch(err) {
                console.log(err);
                setError(err);
            }
        }

        if (router.isReady) {
            getMeta()
        }
        
    }, [router.isReady])

    if (err) {
        <div>
            NOT FOUND
        </div>
    }

    

    return (
        <div dangerouslySetInnerHTML={{ __html: data }} />
    )
}