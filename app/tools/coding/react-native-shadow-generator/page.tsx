import { Metadata } from 'next';
import ReactShadowClient from './ReactShadowClient';

export const metadata: Metadata = {
    title: 'React Native Shadow Generator | WebToolsCenter',
    description: 'Easily generate and customize cross-platform shadow styles for iOS and Android using the React Native Shadow Generator. Adjust shadow color, offset, opacity, radius, and elevation with real-time previews and code export.',
    keywords: 'React Native shadow generator, iOS shadow generator, Android shadow generator, cross-platform shadows, shadow customization tool, mobile app design, React Native shadows, mobile UI shadows',
    openGraph: {
        title: 'React Native Shadow Generator | Cross-Platform Shadow Styles',
        description: 'Generate and customize shadows for iOS and Android with the React Native Shadow Generator. Adjust parameters like color, offset, and radius with real-time previews.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/react-native-shadow-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'React Native Shadow Generator | WebToolsCenter',
        description: 'Customize and generate React Native shadows for iOS and Android with real-time previews and exportable code.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/react-native-shadow-generator',
    },
};

export default function ReactNativeShadowGenerator() {
    return <ReactShadowClient />;
}
