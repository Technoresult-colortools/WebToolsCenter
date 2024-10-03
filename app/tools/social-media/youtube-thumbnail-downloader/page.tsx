import { Metadata } from 'next';
import YoutubeThumbnailClient from './YoutubeThumbnailClient';

export const metadata: Metadata = {
    title: 'YouTube Thumbnail Downloader | WebToolsCenter',
    description: 'Easily download high-quality YouTube thumbnails with our YouTube Thumbnail Downloader. Choose from various resolutions, including HD, and save thumbnails instantly. No login required.',
    keywords: 'youtube thumbnail downloader, download youtube thumbnails, video thumbnail downloader, youtube tools, thumbnail resolutions, youtube marketing, social media tools, HD thumbnail download',
};

  

export default function YouTubeThumbnailDownloader() {
  return <YoutubeThumbnailClient />;
}