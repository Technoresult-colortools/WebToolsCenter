import { Metadata } from 'next';
import AdvancedPasswordGeneratorClient from './AdvancedPasswordGeneratorClient';

export const metadata: Metadata = {
    title: 'Advanced Password Generator | Secure & Custom Passwords | WebToolsCenter',
    description: 'Generate strong, secure, and custom passwords instantly with the Advanced Password Generator. Control length, include special characters, numbers, and letters for maximum security. Free to use.',
    keywords: 'password generator, secure password generator, custom password generator, strong password generator, random password creator, password security tool, online password generator, generate secure passwords, password strength generator',
    openGraph: {
        title: 'Advanced Password Generator | Create Secure Passwords | WebToolsCenter',
        description: 'Easily generate strong and secure passwords with our Advanced Password Generator. Fully customizable with length, numbers, and symbols. Protect your accounts now!',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/advance-password-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Advanced Password Generator | Create Strong & Secure Passwords',
        description: 'Generate strong, custom, and secure passwords in seconds with the Advanced Password Generator. Perfect for ultimate password security and online protection.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/advance-password-generator',
    },
};

export default function AdvancedPasswordGeneratorPage() {
    return <AdvancedPasswordGeneratorClient />;
}
