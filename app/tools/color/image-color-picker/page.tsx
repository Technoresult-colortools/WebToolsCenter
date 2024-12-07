import { Metadata } from 'next';
import ImageColorPickerClient from './ImageColorPickerClient';

export const metadata: Metadata = {
    title: 'Image Color Picker | WebToolsCenter',
    description: 'Extract colors from any image with our Image Color Picker. Easily select, copy, and save colors in HEX, RGB, and HSL formats for your design projects. Features real-time magnification and color history for quick access.',
    keywords: 'image color picker, color extraction, HEX, RGB, HSL, color formats, design tools, color magnifier, color history, web design, graphic design, color picker tool',
    openGraph: {
        title: 'Image Color Picker | Extract Colors from Images',
        description: 'Use the Image Color Picker to extract colors from images effortlessly. Copy colors in HEX, RGB, or HSL formats, and enjoy features like real-time magnification and color history.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/image-color-picker',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Color Picker | Extract Colors with Precision',
        description: 'Extract and save colors from images in HEX, RGB, or HSL formats. Features magnification and color history for seamless design workflows.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/image-color-picker',
    },
};

export default function ImageColorPicker() {
    return <ImageColorPickerClient />;
}
