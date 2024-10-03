import { Metadata } from 'next';
import SvgBlobClient from './SvgBlobClient';

export const metadata: Metadata = {
    title: 'SVG Blob Generator | WebToolsCenter',
    description: 'Effortlessly create customizable SVG blobs with the SVG Blob Generator. Adjust growth, edge count, complexity, and smoothness to craft unique abstract shapes. Export your blob in SVG or PNG format for use in web design, illustrations, or other creative projects.',
    keywords: 'SVG Blob Generator, blob shapes, customizable SVG blobs, abstract design tool, export SVG, export PNG, blob generator online, graphic design tool, web design, creative blobs, random shape generator',
};
   
export default function SVGBlobGenerator() {
  return <SvgBlobClient />;
}