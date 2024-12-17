import { Metadata } from 'next';
import YoutubeThumbnailClient from './YoutubeThumbnailClient';

export const metadata: Metadata = {
    title: 'YouTube Thumbnail Downloader | HD YouTube Thumbnails | WebToolsCenter',
    description: 'Download high-quality YouTube thumbnails instantly with the YouTube Thumbnail Downloader. Choose from multiple resolutions, including HD and Full HD. Free tool, no login required.',
    keywords: 'YouTube thumbnail downloader, download YouTube thumbnails, HD thumbnail downloader, Full HD thumbnail, YouTube tools, video thumbnail downloader, social media tools, YouTube marketing, save YouTube thumbnail, video content tools',
    openGraph: {
        title: 'YouTube Thumbnail Downloader | HD & Full HD Thumbnails | WebToolsCenter',
        description: 'Easily download HD and Full HD YouTube thumbnails in just one click. Perfect for video creators and marketers. No login required.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/social-media/youtube-thumbnail-downloader',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YouTube Thumbnail Downloader | Free HD Thumbnail Download',
        description: 'Quickly download YouTube thumbnails in HD and Full HD resolutions with our free Thumbnail Downloader. Save video thumbnails instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/social-media/youtube-thumbnail-downloader',
    },
};

export default function YouTubeThumbnailDownloader() {
    return <YoutubeThumbnailClient />;
}
