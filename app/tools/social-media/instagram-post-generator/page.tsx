import { Metadata } from 'next';
import InstagramPostGeneratorClient from './InstagramPostGeneratorClient';

export const metadata: Metadata = {
  title: 'Instagram Post Generator | WebToolsCenter',
  description: 'Create stunning Instagram posts with our advanced Instagram Post Generator. Customize every aspect of your post, from images to captions, and preview in real-time.',
  keywords: 'instagram post generator, social media tools, instagram marketing, post creator, image editor, caption generator',
};

export default function InstagramPostGenerator() {
  return <InstagramPostGeneratorClient />;
}