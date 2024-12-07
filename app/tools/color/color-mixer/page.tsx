import { Metadata } from 'next';
import ColorMixerClient from './ColorMixerClient';

export const metadata: Metadata = {
    title: 'Color Mixer | WebToolsCenter',
    description: 'Use our interactive Color Mixer tool to blend two colors and generate a palette of intermediate shades. Perfect for designers and artists looking to enhance their projects with unique color combinations.',
    keywords: 'color mixer, color blending, color palette generator, graphic design, hex color, RGB color, HSL color',
    openGraph: {
        title: 'Color Mixer | Blend Colors and Generate Palettes',
        description: 'Blend two colors seamlessly and generate a palette of intermediate shades with our Color Mixer. Perfect for designers and artists seeking unique color combinations.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/color/color-mixer',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Color Mixer | Blend Colors for Unique Palettes',
        description: 'Mix two colors interactively to create stunning palettes with our Color Mixer tool. Ideal for graphic designers and artists.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/color/color-mixer',
    },
};

export default function ColorMixer() {
    return <ColorMixerClient />;
}
