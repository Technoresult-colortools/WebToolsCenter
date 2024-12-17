import { Metadata } from 'next';
import ScreenResolutionCheckerClient from './ScreenResolutionCheckerClient';

export const metadata: Metadata = {
    title: 'Screen Resolution Checker | Analyze Display Properties | WebToolsCenter',
    description: 'Check and analyze your screen resolution, color depth, refresh rate, pixel density, and HDR capabilities with our Advanced Screen Resolution Checker. Perfect for display analysis.',
    keywords: 'screen resolution checker, display analyzer, screen information tool, check screen resolution, color depth analyzer, refresh rate checker, pixel density test, HDR capability detection, device display analysis, monitor resolution tool',
    openGraph: {
        title: 'Screen Resolution Checker | Advanced Display Analysis | WebToolsCenter',
        description: 'Analyze your screen resolution, refresh rate, color depth, and HDR support with our Screen Resolution Checker. Detailed insights for display optimization.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/screen-resolution-checker',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Screen Resolution Checker | Check Display Properties Online',
        description: 'Quickly analyze your screen resolution, color depth, refresh rate, and pixel density with our Screen Resolution Checker tool. Perfect for display testing.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/screen-resolution-checker',
    },
};

export default function AdvancedScreenChecker() {
    return <ScreenResolutionCheckerClient />;
}
