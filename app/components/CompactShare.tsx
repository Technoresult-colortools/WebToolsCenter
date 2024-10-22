import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from 'react-hot-toast';

interface SharePopupProps {
  currentPath?: string;
}

export const SharePopup = ({ currentPath = "" }: SharePopupProps) => {
  const [toolName, setToolName] = useState("Tool");
  const pathname = usePathname();

  useEffect(() => {
    const extractToolName = () => {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length >= 3) {
        const rawToolName = pathParts[2].replace(/-/g, ' ');
        return rawToolName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
      return "Tool";
    };

    setToolName(extractToolName());
  }, [pathname]);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined' ? `${websiteUrl}${currentPath || pathname}` : '';

  const getShareLinks = (title: string, url: string) => ({
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this tool: ${url}`)}`
  });

  const handleShare = (platform: string, url: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
      return;
    }

    const title = `Check out this ${toolName} tool!`;
    const links = getShareLinks(title, url);
    window.open(links[platform as keyof typeof links], '_blank');
    toast.success(`Sharing on ${platform}`);
  };

  const ShareButtons = ({ url }: { url: string }) => (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <button
        onClick={() => handleShare('facebook', url)}
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 group"
      >
        <Facebook className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
      </button>
      
      <button
        onClick={() => handleShare('twitter', url)}
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 group"
      >
        <Twitter className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
      </button>
      
      <button
        onClick={() => handleShare('linkedin', url)}
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 group"
      >
        <Linkedin className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
      </button>
      
      <button
        onClick={() => handleShare('email', url)}
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 group"
      >
        <Mail className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={() => handleShare('copy', url)}
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border border-blue-400 transition-all duration-300 group col-span-2"
      >
        <Copy className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
        Copy Link
      </button>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          size="sm"
          className="ml-6"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800/95 backdrop-blur-lg border border-gray-700 shadow-xl max-w-md pt-8">
        <Tabs defaultValue="tool" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="tool" className="px-4">Share this Tool</TabsTrigger>
            <TabsTrigger value="website" className="px-4">Share this Website</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tool">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                You are currently sharing:
              </h3>
              <p className="text-2xl font-bold text-white">
                {toolName}
              </p>
              <ShareButtons url={currentUrl} />
            </div>
          </TabsContent>
          
          <TabsContent value="website">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Share our website
              </h3>
              <p className="text-2xl font-bold text-white">
                WebToolsCenter.com
              </p>
              <ShareButtons url={websiteUrl} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;