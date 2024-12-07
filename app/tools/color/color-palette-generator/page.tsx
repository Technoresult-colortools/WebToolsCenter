import { Metadata } from 'next';
import ColorPaletteGeneratorClient from './ColorPaletteGeneratorClient';

export const metadata: Metadata = {
    title: 'Color Palette Generator | WebToolsCenter',
    description: 'Create visually stunning color palettes with the Color Palette Generator. Choose a base color, select a harmony type, and generate custom color schemes perfect for designers, developers, and artists.',
    keywords: 'color palette generator, color scheme tool, color harmony, complementary colors, analogous colors, triadic palette, tetradic palette, monochromatic colors, hex code generator, color design, RGB color scheme, HSL colors, web design tools, UI color preview',
    openGraph: {
        title: 'Color Palette Generator | Create Custom Color Schemes',
        description: 'Design unique color palettes by choosing a base color and harmony type. Generate complementary, analogous, triadic, or tetradic palettes perfect for web design and art.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/color-palette-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Color Palette Generator | WebToolsCenter',
        description: 'Generate custom color palettes using harmony types like complementary, analogous, and triadic. Perfect for web designers, developers, and artists.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/color-palette-generator',
    },
};

export default function ColorPaletteGenerator() {
    return <ColorPaletteGeneratorClient />;
}
