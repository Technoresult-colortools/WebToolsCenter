import { Metadata } from 'next';
import InstagramFiltersClient from './InstagramFiltersClient';

export const metadata: Metadata = {
  title: 'Instagram Filters | WebToolsCenter',
  description: 'Apply Instagram-style filters to your images with our easy-to-use tool. Enhance your photos with a variety of filters and adjustments.',
  keywords: 'instagram filters, photo editing, image filters, photo enhancement, social media tools',
};

export default function InstagramFilters() {
  return <InstagramFiltersClient />;
}