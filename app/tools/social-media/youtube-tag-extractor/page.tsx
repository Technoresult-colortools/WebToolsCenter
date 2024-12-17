import { Metadata } from 'next';
import YoutubeTagExtractClient from './YoutubeTagExtractClient';

export const metadata: Metadata = {
    title: 'YouTube Keyword Tag Extractor | WebToolsCenter',
    description: 'Easily extract keyword tags from any YouTube video with the YouTube Keyword Tag Extractor. Boost your video SEO, discover relevant tags, and enhance video visibility. Free tool, no login required.',
    keywords: 'YouTube keyword tag extractor, extract YouTube tags, video SEO tools, YouTube marketing, YouTube video tags, keyword extractor tool, social media tools, YouTube SEO optimization, YouTube tag finder, video optimization tool',
    openGraph: {
        title: 'YouTube Keyword Tag Extractor | Boost Video SEO | WebToolsCenter',
        description: 'Extract YouTube keyword tags with ease using our free Keyword Tag Extractor. Perfect for video SEO, content marketing, and optimizing video visibility.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/social-media/youtube-tag-extractor',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YouTube Keyword Tag Extractor | Free SEO Tool',
        description: 'Quickly extract YouTube tags and enhance video visibility with our free Keyword Tag Extractor tool. Optimize your YouTube content effortlessly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/social-media/youtube-tag-extractor',
    },
};

export default function YouTubeKeywordTagExtractor() {
    return <YoutubeTagExtractClient />;
}
