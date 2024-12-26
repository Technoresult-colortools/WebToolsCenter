import { Metadata } from 'next';
import InstagramPostGeneratorClient from './InstagramPostGeneratorClient';

export const metadata: Metadata = {
    title: 'Fake Instagram Post Generator | WebToolsCenter',
    description: 'Create realistic Instagram posts with our Fake Instagram Post Generator. Customize profile, captions, engagement, and more with real-time previews and export options.',
    keywords: 'fake instagram post generator, instagram post creator, social media tools, customizable instagram posts, instagram marketing, post generator, caption editor, fake instagram generator',
    openGraph: {
        title: 'Fake Instagram Post Generator | Realistic Post Creator | WebToolsCenter',
        description: 'Design and download realistic Instagram posts with customizable profiles, captions, and engagement metrics. Perfect for social media mockups and fun creations.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/social-media/instagram-post-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fake Instagram Post Generator | WebToolsCenter',
        description: 'Easily generate fake Instagram posts with customizable profiles, captions, and engagement metrics. Real-time previews and export options available.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/social-media/instagram-post-generator',
    },
};

export default function InstagramPostGenerator() {
    return <InstagramPostGeneratorClient />;
}
