import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Define the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webtoolscenter.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Define the path to the 'app' folder
  const appDirectory = path.join(process.cwd(), 'app');
  
  // Function to recursively fetch all pages from the 'app' directory
  const getPages = (directory: string) => {
    let pages: string[] = [];

    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);

      // Recursively add files from subdirectories
      if (fs.statSync(filePath).isDirectory()) {
        if (!file.includes('components') && !file.includes('fonts') && !file.includes('lib')) {
          pages = [...pages, ...getPages(filePath)];
        }
      } else if (
        file.endsWith('.tsx') &&          // Only include .tsx files
        !file.includes('layout') &&       // Exclude layout.tsx
      // Exclude page.tsx
        !file.includes('favicon') &&      // Exclude favicon.tsx
        !file.startsWith('_') &&          // Exclude _app.tsx, _document.tsx, etc.
        !file.includes('[...')            // Exclude dynamic catch-all routes
      ) {
        const relativePath = filePath.replace(process.cwd(), '');
        pages.push(relativePath);
      }
    });

    return pages;
  };

  // Get all pages in the 'app' folder
  const pages = getPages(appDirectory).map((page) => {
    // Remove the '/app' prefix and replace backslashes with forward slashes
    const formattedPage = page
      .replace(/\\/g, '/')                // Ensure correct slash format
      .replace('/app', '')                // Remove 'app' folder from URL
      .replace('/index.tsx', '')          // Handle index files (omit index in the URL)
      .replace('/page.tsx', '')           // Remove 'page.tsx' from URL
      .replace('.tsx', '');               // Remove the file extension

    return {
      url: `${baseUrl}${formattedPage}`,   // Create full URL
      //lastModified: new Date().toISOString(), // Optionally, include the last modified date
    };
  });

  return pages;
}
