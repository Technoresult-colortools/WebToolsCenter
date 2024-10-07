import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
        {
            userAgent: '*', // Default rule for all other user agents
            allow: ['/'],
            disallow: [
              '/private/', // Disallow access to the private folder
              '/api/', // Disallow access to API endpoints
              // Specify any additional paths that should be disallowed
            ]
        },
        
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: '/', // Allow access to the entire site
        disallow: [
          '/private/', // Disallow access to the private folder
          '/api/', // Disallow access to API endpoints
          // Specify any additional paths that should be disallowed
        ],
        
      },
    ],
    sitemap: 'https://webtoolscenter.com/sitemap.xml',
  }
}