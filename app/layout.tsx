import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const metadata: Metadata = {
  title: 'WebToolsCenter - The Ultimate Free Online Tool Collection',
  description: 'Explore WebToolsCenter for free online tools including text converters, image editors, coding utilities, color tools, and more. Simplify your tasks with a wide range of easy-to-use tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                  gtag('config', '${GA_TRACKING_ID}');
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
      </body>
    </html>
  );
}
