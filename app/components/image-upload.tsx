import React, { useRef } from 'react'
import { ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  uploadedImage: string | null
}

export function ImageUpload({ onImageUpload, uploadedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            ref={fileInputRef}
          />
        </label>
      </div>
      {uploadedImage && (
        <div className="mt-4">
          <img src={uploadedImage} alt="Uploaded image" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  )
}

