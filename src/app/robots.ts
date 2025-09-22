import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://battlepoker.devnabatalha.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/o-que-e-planning-poker',
          '/faq'
        ],
        disallow: [
          '/room/',
          '/api/',
          '/_next/',
          '/_vercel/',
          '/admin/',
          '*.json$',
          '/room/*',
          '/room/join/*'
        ],
        crawlDelay: 1
      },
      // Regras específicas para bots de pesquisa principais
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/o-que-e-planning-poker',
          '/faq'
        ],
        disallow: [
          '/room/',
          '/api/'
        ]
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/o-que-e-planning-poker', 
          '/faq'
        ],
        disallow: [
          '/room/',
          '/api/'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
