import { Metadata } from 'next';
import YoutubeMetadataClient from './YoutubeMetadataClient';

export const metadata: Metadata = {
    title: 'YouTube Metadata Extractor | WebToolsCenter',
    description: 'Extract comprehensive metadata from YouTube videos, including titles, descriptions, tags, and statistics. Perfect for YouTube SEO, content analysis, and video optimization.',
    keywords: 'YouTube metadata extractor, YouTube SEO tool, video analytics, extract YouTube tags, video metadata analysis, YouTube data tool, social media marketing, content research tool, YouTube video insights, YouTube statistics extractor',
    openGraph: {
        title: 'YouTube Metadata Extractor | Analyze Video SEO | WebToolsCenter',
        description: 'Analyze YouTube video metadata for better SEO and content strategy. Extract titles, tags, descriptions, and more with our free tool.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/social-media/youtube-metadata-extractor',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YouTube Metadata Extractor Tool | Optimize Video SEO',
        description: 'Extract and analyze metadata from YouTube videos, including tags, titles, and statistics. Enhance your content strategy with this free online tool.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/social-media/youtube-metadata-extractor',
    },
};

export default function YouTubeMetadataExtractor() {
    return <YoutubeMetadataClient />;
}
