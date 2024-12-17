import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { toast } from 'react-hot-toast'

interface TagsProps {
  tags: string[]
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tags.join(', ')).then(() => {
      setCopied(true)
      toast.success('Tags copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">Keyword Tags</h3>
        <Button
          onClick={copyToClipboard}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          {copied ? (
            <Check className="mr-2" size={16} />
          ) : (
            <Copy className="mr-2" size={16} />
          )}
          {copied ? 'Copied!' : 'Copy Tags'}
        </Button>
      </div>
      <div className="max-h-[250px] overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-300">No tags found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tags

