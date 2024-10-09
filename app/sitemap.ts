
import fs from 'fs';
import path from 'path';

// Define the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webtoolscenter.com';

// Define the sitemap entry interface
interface SitemapEntry {
  url: string;
  lastModified?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  const appDirectory = path.join(process.cwd(), 'app');
  
  // Function to determine priority based on URL depth
  const getPriority = (url: string): number => {
    const segments = url.split('/').filter(Boolean);
    if (segments.length === 0) return 1.0; // Homepage
    if (segments.length === 1) return 0.9; // Main sections
    if (segments.length === 2) return 0.8; // Sub-sections
    return 0.7; // Deep pages
  };

  // Function to determine change frequency based on URL pattern
  const getChangeFreq = (url: string): SitemapEntry['changefreq'] => {
    if (url === baseUrl) return 'daily'; // Homepage updates frequently
    if (url.includes('/tools/')) return 'weekly'; // Tool pages update less frequently
    return 'monthly'; // Other pages update monthly
  };

  // Function to recursively fetch all pages
  const getPages = (directory: string): string[] => {
    let pages: string[] = [];

    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);

      if (fs.statSync(filePath).isDirectory()) {
        if (!['components', 'fonts', 'lib'].some(excluded => file.includes(excluded))) {
          pages = [...pages, ...getPages(filePath)];
        }
      } else if (
        file.endsWith('.tsx') &&
        !file.includes('layout') &&
        !file.includes('favicon') &&
        !file.startsWith('_') &&
        !file.includes('[...') &&
        !file.toLowerCase().includes('client') // Filter out client files
      ) {
        const relativePath = filePath.replace(process.cwd(), '');
        pages.push(relativePath);
      }
    });

    return pages;
  };

  // Transform pages into sitemap entries
  const pages = getPages(appDirectory).map((page): SitemapEntry => {
    const formattedPage = page
      .replace(/\\/g, '/')
      .replace('/app', '')
      .replace('/index.tsx', '')
      .replace('/page.tsx', '')
      .replace('.tsx', '');

    const fullUrl = `${baseUrl}${formattedPage}`;

    return {
      url: fullUrl,
      lastModified: new Date().toISOString(),
      changefreq: getChangeFreq(fullUrl),
      priority: getPriority(fullUrl)
    };
  });

  // Filter out any remaining client URLs
  const filteredPages = pages.filter(page => !page.url.toLowerCase().includes('client'));

  return filteredPages;
}