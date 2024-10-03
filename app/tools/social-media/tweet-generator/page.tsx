import { Metadata } from 'next';
import TweetGeneratorClient from './TweetGeneratorClient';

export const metadata: Metadata = {
    title: 'Tweet Generator | WebToolsCenter',
    description: 'Create and visualize tweets effortlessly with our Tweet Generator. Customize every aspect of your tweet, from content to engagement metrics, and export it as an image.',
    keywords: 'tweet generator, create tweets, visualize tweets, social media tools, Twitter content creator, tweet design tool, tweet image export',
  };
  

export default function TweetGenerator() {
  return <TweetGeneratorClient />;
}