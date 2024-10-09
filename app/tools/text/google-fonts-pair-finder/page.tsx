import { Metadata } from 'next';
import GoogleFontsPairClient from './GoogleFontsPairClient';

export const metadata: Metadata = {
    title: 'Google Fonts Pair Finder | WebToolsCenter',
    description: 'Discover harmonious font combinations with our Google Fonts Pair Finder tool. Ideal for designers and developers seeking the perfect typography pairing for web design, print, or branding.',
    keywords: 'Google Fonts, font pairing, typography, font combinations, web design, print design, branding, design tools',
};
  

export default function GoogleFontsPairFinder() {
  return <GoogleFontsPairClient />;
}