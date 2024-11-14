import { Metadata } from 'next';
import JSONTreeViewerClient from './JSONTreeViewerClient';

export const metadata: Metadata = {
    title: 'JSON Tree Viewer | Interactive JSON Visualization | WebToolsCenter',
    description: 'Explore and edit JSON data with our interactive tree viewer. Features customizable themes, collapsible nodes, and real-time editing. Perfect for developers, data analysts, and API testers looking to visualize complex JSON structures.',
    keywords: 'JSON viewer, JSON editor, tree view, JSON visualization, JSON parser, JSON formatter, web development tools, API testing, data structure viewer, JSON explorer, interactive JSON, customizable JSON viewer',
    openGraph: {
      title: 'JSON Tree Viewer | Interactive JSON Visualization',
      description: 'Visualize and manipulate JSON data with our powerful tree viewer. Customizable themes, collapsible nodes, and real-time editing for efficient JSON exploration.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JSON Tree Viewer | Explore and Edit JSON Data Visually',
      description: 'Transform complex JSON structures into interactive, collapsible trees. Edit, add, and delete nodes with ease. Perfect for developers and data analysts.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://webtoolscenter.com/tools/json-tree-viewer',
    }
  };
  
export default function JSONViewerEditor() {
  return <JSONTreeViewerClient />;
}