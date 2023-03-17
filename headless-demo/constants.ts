type Profile = 'dev' | 'stg' | 'prd'

const getProfile = (): Profile => {
  const profile = process.env.PROFILE
  if (profile === 'dev' || profile === 'stg' || profile === 'prd') {
    return profile
  }
  return 'prd'
}

const PROFILE_TO_CMS_URL: Record<Profile, string> = {
  dev: 'https://dev.example.com',
  stg: 'https://staging.example.com',
  prd: 'https://example.com',
}

export const CMS_BASE_URL = PROFILE_TO_CMS_URL[getProfile()]
export const CMS_API_URL = `${CMS_BASE_URL}/wp-json/wp/v2`
export const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY || ''
