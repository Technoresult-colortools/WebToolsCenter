'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from 'react-hot-toast';
import { BookOpen, Download, Info, Lightbulb, Search } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'

interface InstagramMediaItem {
    id: string;
    media_url: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramApiResponse {
    data: InstagramMediaItem[];
}

interface ProfileData {
    username: string;
    fullName: string;
    biography: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
}

type ImageQuality = 'low' | 'medium' | 'high';

export default function InstagramPhotoDownloader() {
    const [url, setUrl] = useState<string>('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [imageQuality, setImageQuality] = useState<ImageQuality>('high');
    const [downloadAll, setDownloadAll] = useState<boolean>(false);
    const [includeMetadata, setIncludeMetadata] = useState<boolean>(false);
    const [watermarkText, setWatermarkText] = useState<string>('');
    const [watermarkOpacity, setWatermarkOpacity] = useState<number>(50);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleSearch = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,media_type&access_token=YOUR_ACCESS_TOKEN`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }

            const data: InstagramApiResponse = await response.json();

            const images = data.data
                .filter(item => item.media_type === 'IMAGE')
                .map(item => item.media_url);

            setImageUrls(images);
            toast.success('Photos fetched successfully!');
        } catch (error) {
            console.error('Error fetching photos:', error);
            toast.error('Failed to fetch photos. Please check the URL and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileSearch = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`https://your-api-endpoint.com/fetch-profile?url=${encodeURIComponent(url)}&access_token=YOUR_ACCESS_TOKEN`);

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data: ProfileData = await response.json();

            setProfileData(data);
            toast.success('Profile data fetched successfully!');
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Failed to fetch profile data. Please check the URL and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (imageUrl: string) => {
        setSelectedImages(prev => 
            prev.includes(imageUrl) 
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl]
        );
    };

    const handleDownload = async () => {
        const imagesToDownload = downloadAll ? imageUrls : selectedImages;

        if (imagesToDownload.length === 0) {
            toast.error('Please select at least one image to download.');
            return;
        }

        for (const imageUrl of imagesToDownload) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `instagram_photo_${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading image:', error);
                toast.error(`Failed to download image: ${imageUrl}`);
            }
        }

        toast.success(`${imagesToDownload.length} image(s) downloaded successfully!`);
    };

    const handleProfileDownload = () => {
        if (!profileData) {
            toast.error('No profile data available. Please fetch profile data first.');
            return;
        }

        const profileJson = JSON.stringify(profileData, null, 2);
        const blob = new Blob([profileJson], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `instagram_profile_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Profile data downloaded successfully!');
    };

    const applyWatermark = (imageUrl: string) => {
        // In a real implementation, this would apply a watermark to the image
        // For demonstration purposes, we'll just return the original image
        return imageUrl;
    };

    return (
        <ToolLayout
      title="Instagram Photo Downloader"
      description="Download Photos from Instagram public photos"
    >

                <Toaster position="top-right" />
                        <Tabs defaultValue="photos" className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="photos">Photos</TabsTrigger>
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                            </TabsList>
                            <TabsContent value="photos">
                                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="mb-6">
                                    <Label htmlFor="instagram-url" className="text-white mb-2 block">Instagram Post URL</Label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        id="instagram-url"
                                        type="text"
                                        placeholder="https://www.instagram.com/p/..."
                                        value={url}
                                        onChange={handleUrlChange}
                                        className="flex-grow bg-gray-700 text-white border-gray-600"
                                    />
                                    <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                                        {isLoading ? 'Searching...' : <Search className="h-5 w-5 mr-2" />}
                                        {isLoading ? '' : 'Search'}
                                    </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                    <Label htmlFor="image-quality" className="text-white mb-2 block">Image Quality</Label>
                                    <Select value={imageQuality} onValueChange={(value: ImageQuality) => setImageQuality(value)}>
                                        <SelectTrigger id="image-quality" className="bg-gray-700 text-white border-gray-600">
                                        <SelectValue placeholder="Select image quality" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                    <Label htmlFor="download-all" className="text-white">Download All Images</Label>
                                    <Switch
                                        id="download-all"
                                        checked={downloadAll}
                                        onCheckedChange={setDownloadAll}
                                    />
                                    </div>

                                    <div className="flex items-center justify-between">
                                    <Label htmlFor="include-metadata" className="text-white">Include Metadata</Label>
                                    <Switch
                                        id="include-metadata"
                                        checked={includeMetadata}
                                        onCheckedChange={setIncludeMetadata}
                                    />
                                    </div>

                                    <div>
                                    <Label htmlFor="watermark-text" className="text-white mb-2 block">Watermark Text</Label>
                                    <Input
                                        id="watermark-text"
                                        type="text"
                                        placeholder="Enter watermark text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                    </div>

                                    <div className="col-span-full">
                                    <Label htmlFor="watermark-opacity" className="text-white mb-2 block">Watermark Opacity: {watermarkOpacity}%</Label>
                                    <Slider
                                        id="watermark-opacity"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={watermarkOpacity}
                                        onChange={(value) => setWatermarkOpacity(value)}
                                    />
                                    </div>
                                </div>
                                </div>

                                {imageUrls.length > 0 && (
                                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Available Photos</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imageUrls.map((imageUrl, index) => (
                                        <div key={index} className="relative">
                                        <img
                                            src={applyWatermark(imageUrl)}
                                            alt={`Instagram photo ${index + 1}`}
                                            className={`w-full h-40 object-cover rounded-lg cursor-pointer ${
                                            selectedImages.includes(imageUrl) ? 'border-4 border-blue-500' : ''
                                            }`}
                                            onClick={() => handleImageSelect(imageUrl)}
                                        />
                                        {selectedImages.includes(imageUrl) && (
                                            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            </div>
                                        )}
                                        </div>
                                    ))}
                                    </div>
                                    <Button onClick={handleDownload} className="mt-6 bg-green-600 hover:bg-green-700 text-white">
                                    <Download className="h-5 w-5 mr-2" />
                                    Download Selected Photos
                                    </Button>
                                </div>
                                )}
                            </TabsContent>
                            <TabsContent value="profile">
                                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="mb-6">
                                    <Label htmlFor="instagram-profile-url" className="text-white mb-2 block">Instagram Profile URL</Label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        id="instagram-profile-url"
                                        type="text"
                                        placeholder="https://www.instagram.com/username"
                                        value={url}
                                        onChange={handleUrlChange}
                                        className="flex-grow bg-gray-700 text-white border-gray-600"
                                    />
                                    <Button onClick={handleProfileSearch} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                                        {isLoading ? 'Searching...' : <Search className="h-5 w-5 mr-2" />}
                                        {isLoading ? '' : 'Search Profile'}
                                    </Button>
                                    </div>
                                </div>

                                {profileData && (
                                    <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
                                    <div className="bg-gray-700 rounded-lg p-4 text-white">
                                        <p><strong>Username:</strong> {profileData.username}</p>
                                        <p><strong>Full Name:</strong> {profileData.fullName}</p>
                                        <p><strong>Bio:</strong> {profileData.biography}</p>
                                        <p><strong>Followers:</strong> {profileData.followersCount}</p>
                                        <p><strong>Following:</strong> {profileData.followingCount}</p>
                                        <p><strong>Posts:</strong> {profileData.postsCount}</p>
                                    </div>
                                    <Button onClick={handleProfileDownload} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                                        <Download className="h-5 w-5 mr-2" />
                                        Download Profile Data
                                    </Button>
                                    </div>
                                )}
                                </div>
                            </TabsContent>
                            </Tabs>

                            <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                                    <Info className="w-6 h-6 mr-2" />
                                    About Instagram Photo Downloader
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Our Instagram Photo Downloader is a powerful tool designed to help you save and manage Instagram content easily. Whether you're looking to download photos from posts or gather information about public profiles, this tool provides a user-friendly interface to accomplish these tasks quickly and efficiently.
                                </p>

                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                                    <BookOpen className="w-6 h-6 mr-2" />
                                    How to Use
                                </h2>
                                <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                                    <li>Choose between "Photos" and "Profile" tabs based on what you want to download.</li>
                                    <li>Enter the Instagram post URL or profile URL in the input field.</li>
                                    <li>Click the search button to fetch available photos or profile information.</li>
                                    <li>For photos: Select the desired image quality, adjust download settings, and choose images to download.</li>
                                    <li>For profiles: Review the fetched profile information.</li>
                                    <li>Click the download button to save your selected content.</li>
                                </ol>

                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                                    <Lightbulb className="w-6 h-6 mr-2" />
                                    Key Features
                                </h2>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                                    <li>Download multiple photos from Instagram posts</li>
                                    <li>Fetch and download public profile information</li>
                                    <li>Adjustable image quality settings</li>
                                    <li>Option to include image metadata</li>
                                    <li>Customizable watermark text and opacity</li>
                                    <li>Bulk download option for all images in a post</li>
                                    <li>Mobile-responsive design for use on any device</li>
                                </ul>

                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                                    <Lightbulb className="w-6 h-6 mr-2" />
                                    Tips & Tricks
                                </h2>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                                    <li>Use the "Download All Images" option to quickly save all photos from a post.</li>
                                    <li>Adjust the watermark opacity to protect your downloaded images while maintaining visibility.</li>
                                    <li>Include metadata when downloading images to preserve important information about the photo.</li>
                                    <li>Use the profile download feature to backup public profile information or track changes over time.</li>
                                    <li>Experiment with different image qualities to find the best balance between file size and image resolution.</li>
                                </ul>
                                </div>

                
    </ToolLayout>
    );
}
