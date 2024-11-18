import { Metadata } from 'next';
import OpenGraphMetaClient from './OpenGraphMetaClient';

export const metadata: Metadata = {
    title: 'Open Graph Meta Generator | Optimize Social Sharing | WebToolsCenter',
    description: 'Create perfect Open Graph meta tags for enhanced social media sharing. Customize titles, descriptions, and images for various content types. Real-time preview and instant code generation for optimal social media presence.',
    keywords: 'Open Graph meta generator, social media optimization, meta tags creator, OG tags, Facebook sharing, Twitter cards, LinkedIn posts, social media preview, SEO tools, web development, content sharing, social media marketing',
    openGraph: {
        title: 'Open Graph Meta Generator | Optimize Social Sharing',
        description: 'Craft Open Graph meta tags tailored for your content. Boost social media visibility with real-time preview and instant code generation.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Open Graph Meta Generator | Enhance Your Social Media Presence',
        description: 'Generate Open Graph meta tags easily with our tool. Customize for Facebook, Twitter, and LinkedIn with live previews.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/open-graph-meta-generator',
    }
};
  
export default function OpenGraphGenerator() {
  return <OpenGraphMetaClient />;
}