import { Metadata } from 'next';
import AdvanceBarCodeGeneratorClient from './AdvanceBarcodeGeneratorClient';

export const metadata: Metadata = {
    title: 'Barcode Generator | Create Custom Barcodes Online | WebToolsCenter',
    description: 'Easily generate barcodes online with our Barcode Generator. Supports various barcode formats like UPC, EAN, Code128, and more for professional and personal use. Instant and free.',
    keywords: 'barcode generator, generate barcode online, barcode creator, barcode maker, custom barcode generator, barcode generator tool, UPC barcode, EAN barcode, Code128 generator, barcode online tool',
    openGraph: {
        title: 'Barcode Generator | Generate Custom Barcodes | WebToolsCenter',
        description: 'Create professional and custom barcodes in seconds with the Barcode Generator. Supports UPC, EAN, Code128, and other popular formats. Free and easy to use!',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/barcode-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Barcode Generator | Create Custom Barcodes Online',
        description: 'Easily generate custom barcodes in various formats like UPC, EAN, and Code128 with our Barcode Generator. Fast, free, and online.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/barcode-generator',
    },
};

export default function AdvancedBarcodeGeneratorPage() {
    return <AdvanceBarCodeGeneratorClient />;
}
