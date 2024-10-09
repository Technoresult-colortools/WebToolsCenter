import { Metadata } from 'next';
import CaseConverterClient from './CaseConverterClient';

export const metadata: Metadata = {
    title: 'Case Converter | WebToolsCenter',
    description: 'Easily convert text between various cases and perform advanced text manipulations with our Case Converter tool. Ideal for developers, writers, and content creators.',
    keywords: 'case converter, text case conversion, text manipulation, uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, toggle case, text tools',
  };  

export default function CaseConverter() {
  return <CaseConverterClient />;
}