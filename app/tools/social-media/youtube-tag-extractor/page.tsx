import { Metadata } from 'next';
import YoutubeTagExtractClient from './YoutubeTagExtractClient';

export const metadata: Metadata = {
    title: 'YouTube Keyword Tag Extractor | WebToolsCenter',
    description: 'Extract keyword tags from any YouTube video effortlessly with our YouTube Keyword Tag Extractor. Enhance video SEO, discover relevant tags, and improve your video’s visibility. No login required.',
    keywords: 'youtube keyword tag extractor, extract youtube tags, video SEO tools, youtube marketing, youtube video tags, keyword extractor, social media tools, youtube SEO',
};

export default function YouTubeKeywordTagExtractor() {
  return <YoutubeTagExtractClient />;
}