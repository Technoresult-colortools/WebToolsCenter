import { Metadata } from 'next';
import YoutubeRegionRestrictionClient from './YoutubeRegionRestrictionClient';

export const metadata: Metadata = {
    title: 'YouTube Region Restriction Finder | WebToolsCenter',
    description: 'Check YouTube video availability across different regions instantly. Identify geo-restrictions, optimize global reach, and improve content strategy. Free tool, no login required.',
    keywords: 'youtube region restriction finder, geo-blocking checker, video availability tool, global content strategy, youtube marketing, content distribution, international audience, youtube analytics',
  };

export default function YouTubeRegionRestrictionFinder() {
  return <YoutubeRegionRestrictionClient />;
}