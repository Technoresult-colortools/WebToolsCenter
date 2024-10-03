import { Metadata } from 'next';
import AdvancedPasswordGeneratorClient from './AdvancedPasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Advanced Password Generator | WebToolsCenter',
  description: 'Create strong, secure passwords with our Advanced Password Generator. Customize length, character types, and more for ultimate password security.',
  keywords: 'password generator, secure password, custom password, password security',
};

export default function AdvancedPasswordGeneratorPage() {
  return <AdvancedPasswordGeneratorClient />;
}