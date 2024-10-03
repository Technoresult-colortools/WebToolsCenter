import { Metadata } from 'next';
import ListRandomiserClient from './ListRandomiserClient';
export const metadata: Metadata = {
  title: 'List Randomizer | WebToolsCenter',
  description: 'Easily randomize any list of items with our List Randomizer tool. Perfect for decision-making, contests, or shuffling entries with just a click.',
  keywords: 'list randomizer, randomize list, shuffle list, random list generator, list shuffle tool, randomizer online, list shuffler'
};


export default function ListRandomizer() {
  return <ListRandomiserClient />;
}