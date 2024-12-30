
'use client'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ClientCookieBanner from '@/components/CookieConsentBanner'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [, setCookieConsent] = useState<string | null>(null)
  
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent')
    setCookieConsent(savedConsent)
    
    if (GA_TRACKING_ID && !savedConsent) {
      initializeBasicAnalytics()
    }
  }, [])

  const initializeBasicAnalytics = () => {
    // Type-safe gtag call
    window.gtag?.('config', GA_TRACKING_ID!, {
      'consent_mode': 'default',
      'restricted_data_processing': true,
      'anonymize_ip': true,
      'client_storage': 'none',
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false,
      'custom_map': {
        'dimension1': 'page_path',
        'dimension2': 'client_id',
        'dimension3': 'consent_status'
      }
    })
  }

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setCookieConsent('accepted')
    
    if (GA_TRACKING_ID && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'personalization_storage': 'granted',
        'functionality_storage': 'granted'
      })
      
      window.gtag('set', {
        'restricted_data_processing': false,
        'allow_google_signals': true,
        'allow_ad_personalization_signals': true
      })
      
      window.gtag('event', 'consent_update', {
        'consent_status': 'accepted'
      })
    }
  }

  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setCookieConsent('declined')
    
    if (GA_TRACKING_ID && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'personalization_storage': 'denied',
        'functionality_storage': 'denied'
      })
      
      window.gtag('event', 'consent_update', {
        'consent_status': 'declined'
      })
    }
  }

  return (
    <html lang="en">
      <head>
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  gtag('config', '${GA_TRACKING_ID}', {
                    'restricted_data_processing': true,
                    'anonymize_ip': true,
                    'client_storage': 'none',
                    'allow_google_signals': false,
                    'allow_ad_personalization_signals': false
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow pt-16">
          {children}
        </main>
        <ClientCookieBanner onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
      </body>
    </html>
  )
}