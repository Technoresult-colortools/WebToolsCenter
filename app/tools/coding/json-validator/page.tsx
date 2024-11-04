import { Metadata } from 'next';
import JsonValidatorClient from './JsonValidatorClient';

export const metadata: Metadata = {
    title: 'JSON Validator | WebToolsCenter',
    description: 'Validate, format, and optimize JSON with the JSON Validator tool. Ensure the accuracy of your JSON data, beautify or minify JSON structures, and enhance your development process with fast validation.',
    keywords: 'JSON validator, validate JSON, JSON formatting, beautify JSON, minify JSON, JSON schema validation, JSON path query, JSON file upload, JSON syntax checker, JSON error detection, JSON tools',
};
 
export default function JsonValidator() {
  return <JsonValidatorClient />;
}