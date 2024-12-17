import { Metadata } from 'next';
import InstagramFiltersClient from './InstagramFiltersClient';

export const metadata: Metadata = {
    title: 'Instagram Filters Online Tool | Apply 30+ Filters to Photos',
    description: 'Easily apply 30+ Instagram-style filters like Clarendon, Gingham, Juno, and more to your photos with our Instagram Filters Tool. Enhance your images with creative effects and download them instantly.',
    keywords: 'Instagram filters, photo filters, online image editing, Clarendon filter, Gingham filter, Juno filter, photo enhancement tool, Instagram photo editor, apply Instagram effects, best Instagram filters, social media photo editing',
    openGraph: {
        title: 'Instagram Filters Tool | Apply 30+ Stunning Filters to Photos',
        description: 'Apply Instagram-inspired filters like Clarendon, Moon, Hudson, and more to your images. Perfect for enhancing your social media photos with unique styles.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/social-media/instagram-filters',
        images: [
            {
                url: 'https://webtoolscenter.com/Images/InstagramFiltersPreview.png',
                alt: 'Instagram Filters Online Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instagram Filters Tool | Enhance Your Photos',
        description: 'Use 30+ Instagram-style filters like Clarendon, Juno, Hudson, and more to transform your photos for social media.',
        images: ['https://webtoolscenter.com/Images/InstagramFiltersPreview.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/social-media/instagram-filters',
    },
};

export default function InstagramFilters() {
    return <InstagramFiltersClient />;
}
