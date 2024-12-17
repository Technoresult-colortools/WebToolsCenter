import { Metadata } from 'next';
import JsonValidatorClient from './JsonValidatorClient';

export const metadata: Metadata = {
    title: 'JSON Validator | WebToolsCenter',
    description: 'Validate, format, and optimize JSON with the JSON Validator tool. Ensure the accuracy of your JSON data, beautify or minify JSON structures, and enhance your development process with fast validation.',
    keywords: 'JSON validator, validate JSON, JSON formatting, beautify JSON, minify JSON, JSON schema validation, JSON path query, JSON file upload, JSON syntax checker, JSON error detection, JSON tools',
    openGraph: {
        title: 'JSON Validator | Validate and Optimize JSON | WebToolsCenter',
        description: 'Quickly validate and format your JSON data with our JSON Validator tool. Beautify or minify JSON structures and detect errors in real time.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/json-validator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JSON Validator | Fast and Accurate JSON Validation',
        description: 'Validate and optimize your JSON data with the JSON Validator. Beautify or minify JSON and detect errors instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/json-validator',
    },
};

export default function JsonValidator() {
    return <JsonValidatorClient />;
}
