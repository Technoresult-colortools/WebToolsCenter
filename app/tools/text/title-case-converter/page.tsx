import { Metadata } from 'next';
import TitleCaseConverterClient from './TitleCaseConverterClient';

export const metadata: Metadata = {
    title: 'Advanced Title Case Converter | WebToolsCenter',
    description: 'Transform your text into perfectly formatted titles with the Advanced Title Case Converter. Offering intelligent capitalization, multiple formatting styles, and advanced features like conversion history and file handling for professional content creation.',
    keywords: 'advanced title case converter, intelligent capitalization, title case styles, professional content formatting, headline formatting, text conversion, format preservation, statistical analysis, acronym handling, content creation tools',
};


export default function TitleCaseConverter() {
  return <TitleCaseConverterClient />;
}