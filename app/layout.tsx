import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head'; // Import Head for meta tags

const inter = Inter({ subsets: ['latin'] });

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
      <Head>
        {/* Google Analytics Script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DB0SJSJQ1H"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DB0SJSJQ1H');
            `,
          }}
        />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
