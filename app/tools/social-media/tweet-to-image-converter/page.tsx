import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const TweetToImageClient = dynamic(
  () => import('./TweetToImageClient'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Tweet to Image Converter | WebToolsCenter',
  description: 'Easily convert tweets into visually appealing images with our Tweet to Image Converter. Customize layouts, backgrounds, and add watermarks to create engaging content for social media. Export in PNG or JPEG formats with real-time previews.',
  keywords: 'tweet to image converter, social media tools, tweet image creator, twitter post to image, tweet visualizer, image generator, social media marketing, PNG export, JPEG export',
};

export default function TweetToImageConverterPage() {
  return <TweetToImageClient />;
}