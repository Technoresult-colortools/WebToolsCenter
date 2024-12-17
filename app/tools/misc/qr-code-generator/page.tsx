import { Metadata } from 'next';
import QRCodeGeneratorClient from './QRCodeGeneratorClient';

export const metadata: Metadata = {
    title: 'QR Code Generator | Create Custom QR Codes Online | WebToolsCenter',
    description: 'Generate custom QR codes effortlessly with our QR Code Generator. Perfect for business, personal, and professional use. Create, customize, and download QR codes instantly.',
    keywords: 'QR code generator, custom QR codes, generate QR code online, QR code creator, business QR codes, personal QR code tool, QR code maker, dynamic QR codes, static QR codes, free QR code generator',
    openGraph: {
        title: 'QR Code Generator | Create and Customize QR Codes | WebToolsCenter',
        description: 'Easily generate and customize QR codes for business or personal use with our QR Code Generator. Download high-quality QR codes instantly.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/qr-code-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'QR Code Generator | Online Custom QR Code Creator',
        description: 'Quickly generate and customize QR codes with our QR Code Generator. Perfect for business and personal use. Download instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/qr-code-generator',
    },
};

export default function QRCodeGenerator() {
    return <QRCodeGeneratorClient />;
}
