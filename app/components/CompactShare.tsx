import React from 'react';
import { Button } from "@/components/ui/Button";
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CompactShare() {
  const handleShare = (platform: string) => {
    // Here you would implement the sharing logic for each platform
    console.log(`Sharing on ${platform}`);
    toast.success(`Shared on ${platform}!`);
  };

  return (
    <div className="bg-gray-800 rounded-xl mb-6 shadow-lg p-4 md:p-8 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-white mb-2">Share</h3>
      <div className="flex space-x-2">
        <Button 
          onClick={() => handleShare('Twitter')} 
          size="sm"
          className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => handleShare('Facebook')} 
          size="sm"
          className="bg-[#4267B2] hover:bg-[#365899] text-white"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => handleShare('LinkedIn')} 
          size="sm"
          className="bg-[#0077B5] hover:bg-[#006699] text-white"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}