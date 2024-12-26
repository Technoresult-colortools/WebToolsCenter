import { Metadata } from 'next';
import UnitConverterClient from './UnitConverterClient';

export const metadata: Metadata = {
    title: 'Unit Converter | Convert Measurements Online | WebToolsCenter',
    description: 'Easily convert between various units of measurement with our Unit Converter. Supports conversions for length, weight, volume, temperature, and more.',
    keywords: 'unit converter, online unit conversion tool, convert measurements, length converter, weight converter, volume converter, temperature converter, measurement converter, convert units online, universal converter',
    openGraph: {
        title: 'Unit Converter | Convert Units Online | WebToolsCenter',
        description: 'Quickly convert measurements like length, weight, volume, and temperature with our user-friendly Unit Converter. Accurate and efficient conversions.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/unit-converter',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Unit Converter | Convert Measurements Online | WebToolsCenter',
        description: 'Simplify conversions with our Unit Converter. Convert length, weight, temperature, and more with ease. Accurate, fast, and free.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/unit-converter',
    },
};

export default function UnitConverter() {
    return <UnitConverterClient />;
}
