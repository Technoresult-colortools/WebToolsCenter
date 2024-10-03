import { Metadata } from 'next';
import UnitConverterClient from './UnitConverterClient';
export const metadata: Metadata = {
    title: 'Unit Converter | WebToolsCenter',
    description: 'Easily convert between various units of measurement with our Unit Converter. Convert length, weight, volume, temperature, and more.',
    keywords: 'unit converter, convert units, measurement converter, length converter, weight converter, volume converter, temperature converter, online unit conversion tool'
};

export default function UnitConverter() {
  return <UnitConverterClient />;
}