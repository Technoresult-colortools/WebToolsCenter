import React, { useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { RefreshCw } from 'lucide-react'

interface CustomFileInputProps {
  id: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
  accept?: string
  className?: string
  fileName: string
  setFileName: (name: string) => void
}

export function CustomFileInput({ 
  id, 
  onChange, 
  onReset, 
  accept, 
  className,
  fileName,
  setFileName
}: CustomFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
    onChange(event)
  }

  const handleReset = () => {
    setFileName('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onReset()
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative flex-grow">
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="bg-gray-700 text-white border-gray-600 w-full"
          ref={inputRef}
        />
        {fileName && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">
            {fileName}
          </span>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={handleReset}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}

