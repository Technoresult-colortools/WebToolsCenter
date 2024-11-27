import { Metadata } from 'next';
import TitleCaseConverterClient from './TitleCaseConverterClient';

export const metadata: Metadata = {
    title: 'Advanced Title Case Converter | Intelligent Capitalization | WebToolsCenter',
    description: 'Easily format text into perfectly capitalized titles with our Advanced Title Case Converter. Enjoy intelligent capitalization, multiple styles, and professional content creation features like acronym handling and file processing.',
    keywords: 'advanced title case converter, intelligent capitalization, title case styles, professional content formatting, headline formatting, text conversion, format preservation, statistical analysis, acronym handling, content creation tools',
    openGraph: {
        title: 'Advanced Title Case Converter | Intelligent Text Formatting',
        description: 'Transform your text into professional, perfectly formatted titles with our Advanced Title Case Converter. Featuring intelligent capitalization and multiple formatting styles.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/title-case-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Advanced Title Case Converter | Perfect Headline Formatter',
        description: 'Format text into titles effortlessly with our Title Case Converter. Intelligent capitalization and advanced formatting tools included.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/title-case-converter',
    }
};

export default function TitleCaseConverter() {
    return <TitleCaseConverterClient />;
}
