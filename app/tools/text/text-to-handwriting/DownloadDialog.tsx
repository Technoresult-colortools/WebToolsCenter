import React, { useState } from 'react';
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Download } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DownloadDialogProps {
  handleDownload: (options: { dpi: number; format: 'png' | 'pdf'; quality: number }) => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ handleDownload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDpi, setSelectedDpi] = useState<string>('300');
  const [selectedQuality, setSelectedQuality] = useState<string>('1');
  const [selectedFormat, setSelectedFormat] = useState<string>('png');

  const handleDownloadClick = () => {
    handleDownload({
      dpi: parseInt(selectedDpi, 10),
      format: selectedFormat as 'png' | 'pdf',
      quality: parseFloat(selectedQuality)
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex-1" variant="default">
        <Download className="w-4 h-4 mr-2" />
        High Quality
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Download Options</AlertDialogTitle>
            <AlertDialogDescription>
              Choose your preferred download settings
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resolution (DPI)</Label>
              <Select
                value={selectedDpi}
                onValueChange={setSelectedDpi}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select DPI" />
                </SelectTrigger>
                <SelectContent className='bg-gray-800'>
                  <SelectItem value="150">150 DPI - Good</SelectItem>
                  <SelectItem value="300">300 DPI - Better</SelectItem>
                  <SelectItem value="600">600 DPI - Best</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select
                value={selectedQuality}
                onValueChange={setSelectedQuality}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Quality" />
                </SelectTrigger>
                <SelectContent className='bg-gray-800'>
                  <SelectItem value="0.8">80% - Good</SelectItem>
                  <SelectItem value="0.9">90% - Better</SelectItem>
                  <SelectItem value="1">100% - Best</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={selectedFormat}
                onValueChange={setSelectedFormat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent className='bg-gray-800'>
                  <SelectItem value="png">PNG - Single Page</SelectItem>
                  <SelectItem value="pdf">PDF - All Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="w-full sm:w-auto" 
              onClick={handleDownloadClick}
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DownloadDialog;

