import { Metadata } from 'next';
import UrlToSlugClient from './UrlToSlugClient';

export const metadata: Metadata = {
    title: 'URL to Slug Creator | WebToolsCenter',
    description: 'Easily convert text into SEO-friendly URL slugs with the URL to Slug Creator. Customize separators, case options, and more for optimized URLs.',
    keywords: 'URL to slug, slug generator, URL slug, SEO-friendly URLs, text to slug converter, URL optimization, slug creator tool, URL to text',
  };  
  
export default function URLSlugCreator() {
  return <UrlToSlugClient />;
}