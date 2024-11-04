import { Metadata } from 'next';
import YoutubeMetadataClient from './YoutubeMetadataClient';

export const metadata: Metadata = {
  title: 'YouTube Metadata Extractor | WebToolsCenter',
  description: 'Extract comprehensive metadata from any YouTube video. Analyze titles, descriptions, tags, statistics, and more. Enhance your content strategy and SEO. Free tool, no login required.',
  keywords: 'youtube metadata extractor, video analytics tool, youtube SEO, content analysis, video statistics, youtube data API, social media marketing, youtube research',
};

export default function YouTubeMetadataExtractor() {
  return <YoutubeMetadataClient />;
}