import { Metadata } from 'next';
import ListRandomiserClient from './ListRandomiserClient';

export const metadata: Metadata = {
    title: 'List Randomizer | Shuffle and Randomize Items Online | WebToolsCenter',
    description: 'Randomize any list of items effortlessly with our List Randomizer. Perfect for decision-making, contests, or shuffling entries. Customize and shuffle with just a click.',
    keywords: 'list randomizer, shuffle list online, randomize list tool, list shuffler, random list generator, online list randomizer, contest randomizer, decision-making tool, shuffle tool, randomize entries',
    openGraph: {
        title: 'List Randomizer | Shuffle and Randomize Lists | WebToolsCenter',
        description: 'Easily shuffle and randomize any list of items with our List Randomizer. Great for decision-making, contests, or generating random orders.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/misc/list-randomizer',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'List Randomizer | Shuffle Lists Instantly | WebToolsCenter',
        description: 'Quickly randomize and shuffle lists with our List Randomizer tool. Ideal for decision-making, contests, and random order generation.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/misc/list-randomizer',
    },
};

export default function ListRandomizer() {
    return <ListRandomiserClient />;
}
