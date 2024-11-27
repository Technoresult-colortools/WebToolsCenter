import { Metadata } from 'next';
import CaseConverterClient from './CaseConverterClient';

export const metadata: Metadata = {
    title: 'Case Converter | Text Case Conversion Tool | WebToolsCenter',
    description: 'Easily convert text between various cases and perform advanced text manipulations with our Case Converter tool. Ideal for developers, writers, and content creators.',
    keywords: 'case converter, text case conversion, text manipulation, uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, toggle case, text tools',
    openGraph: {
        title: 'Case Converter | Text Case Conversion Tool',
        description: 'Convert text to uppercase, lowercase, title case, and more with our Case Converter tool. Perfect for developers, writers, and content creators.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/text/case-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Case Converter | Convert Text to Any Case Format',
        description: 'Effortlessly convert text between cases like uppercase, camelCase, snake_case, and more. Streamline your workflow with advanced text tools.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/text/case-converter',
    }
};

export default function CaseConverter() {
    return <CaseConverterClient />;
}
