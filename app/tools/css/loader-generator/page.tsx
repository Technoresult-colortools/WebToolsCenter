import { Metadata } from 'next';
import LoaderGeneratorClient from './LoaderGeneratorClient';

export const metadata: Metadata = {
    title: 'CSS Loader Generator | Modern Loading Animations | WebToolsCenter',
    description: 'Create customizable CSS loading animations for your web projects. Choose from multiple categories including spinners, dots, and bars. Customize colors, sizes, and animation speeds with real-time preview and instant code generation.',
    keywords: 'CSS loader generator, loading animations, CSS spinners, loading indicators, web loaders, CSS animations, custom loaders, animated spinners, loading dots, progress bars, web development tools, CSS animation generator',
    openGraph: {
      title: 'CSS Loader Generator | Modern Loading Animations',
      description: 'Design professional loading animations with our CSS Loader Generator. Customize colors, sizes, and speeds with instant preview. Perfect for modern web projects.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CSS Loader Generator | Create Custom Loading Animations',
      description: 'Generate beautiful, customizable loading animations for your website. Real-time preview and instant code generation.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://webtoolscenter.com/tools/loader-generator',
    }
  };  
  
export default function LoaderGenerator() {
  return <LoaderGeneratorClient />;
}