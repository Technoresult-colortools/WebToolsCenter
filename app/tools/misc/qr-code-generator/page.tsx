import { Metadata } from 'next';
import QRCodeGeneratorClient from './QRCodeGeneratorClient';
export const metadata: Metadata = {
    title: 'QR Code Generator | WebToolsCenter',
    description: 'Create QR codes effortlessly with our QR Code Generator. Customize your QR codes for business, personal, or professional use.',
    keywords: 'QR code generator, generate QR code, QR code tool, online QR code, QR code creator, custom QR codes',
  };

export default function QRCodeGenerator() {
  return <QRCodeGeneratorClient />;
}