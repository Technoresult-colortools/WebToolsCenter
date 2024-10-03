import { Metadata } from 'next';
import InstagramPhotoDownloaderClient from './InstagramPhotoDownloaderClient';

export const metadata: Metadata = {
    title: 'Instagram Photo Downloader | WebToolsCenter',
    description: 'Easily download photos from Instagram posts by simply pasting the URL. Our Instagram Photo Downloader allows you to download high-quality images quickly and efficiently.',
    keywords: 'instagram photo downloader, download instagram images, instagram downloader, save instagram photos, online instagram photo download tool, instagram post download',
  };
  

export default function InstagramPhotoDownloader() {
  return <InstagramPhotoDownloaderClient />;
}