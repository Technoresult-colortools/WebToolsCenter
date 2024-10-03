import { Metadata } from 'next';
import AdvanceBarCodeGeneratorClient from './AdvanceBarcodeGeneratorClient';
export const metadata: Metadata = {
  title: 'BarCode Generator | WebToolsCenter',
  description: 'Generate barcodes quickly and easily with our BarCode Generator. Supports various formats for professional and personal use.',
  keywords: 'barcode generator, barcode creator, barcode online, generate barcode, barcode tool',
};

export default function AdvancedBarcodeGeneratorPage() {
  return <AdvanceBarCodeGeneratorClient />;
}
