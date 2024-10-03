import { Metadata } from 'next';
import ReactShadowClient from './ReactShadowClient';

export const metadata: Metadata = {
    title: 'React Native Shadow Generator | WebToolsCenter',
    description: 'Easily generate and customize cross-platform shadow styles for iOS and Android using the React Native Shadow Generator. Adjust shadow color, offset, opacity, radius, and elevation with real-time previews and code export.',
    keywords: 'React Native shadow generator, iOS shadow generator, Android shadow generator, cross-platform shadows, shadow customization tool, mobile app design, React Native shadows, mobile UI shadows',
}; 
  
export default function ShadowGenerator() {
  return <ReactShadowClient />;
}