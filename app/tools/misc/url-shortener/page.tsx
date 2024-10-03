import { Metadata } from 'next';
import UrlShortenerClient from './UrlShortenerClient';
export const metadata: Metadata = {
    title: 'URL Shortener | WebToolsCenter',
    description: 'Shorten long URLs easily with our URL Shortener tool. Generate compact links, track clicks, manage history, and more. Perfect for sharing links on social media, emails, and campaigns.',
    keywords: 'URL shortener, shorten URL, link shortener, URL shortening tool, track URL clicks, create short URLs, online URL shortener, manage URLs, URL history, copy short URLs'
};


export default function URLShortener() {
  return <UrlShortenerClient />;
}