import { Metadata } from 'next';
import ColorPaletteGeneratorClient from './ColorPaletteGeneratorClient';

export const metadata: Metadata = {
    title: 'Color Palette Generator | WebToolsCenter',
    description: 'Create visually stunning color palettes with the Color Palette Generator. Choose a base color, select a harmony type, and generate custom color schemes perfect for designers, developers, and artists.',
    keywords: 'color palette generator, color scheme tool, color harmony, complementary colors, analogous colors, triadic palette, tetradic palette, monochromatic colors, hex code generator, color design, RGB color scheme, HSL colors, web design tools, UI color preview',
};
   
export default function ColorPaletteGenerator() {
  return <ColorPaletteGeneratorClient />;
}