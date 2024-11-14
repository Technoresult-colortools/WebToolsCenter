'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import Link from 'next/link'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Download, Info, BookOpen, Lightbulb, Code, Eye, Edit, Trash, Plus, Paintbrush } from 'lucide-react'
import TreeView from './Treeview'
import ToolLayout from '@/components/ToolLayout'

const themes = {
  'monokai': {
    background: 'bg-gray-900',
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-purple-400',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'dracula': {
    background: 'bg-gray-900',
    string: 'text-green-300',
    number: 'text-purple-300',
    boolean: 'text-pink-300',
    null: 'text-red-300',
    key: 'text-cyan-300',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'night-owl': {
    background: 'bg-gray-900',
    string: 'text-green-200',
    number: 'text-blue-200',
    boolean: 'text-orange-200',
    null: 'text-red-200',
    key: 'text-cyan-200',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'solarized-dark': {
    background: 'bg-gray-800',
    string: 'text-green-500',
    number: 'text-blue-500',
    boolean: 'text-yellow-500',
    null: 'text-red-500',
    key: 'text-cyan-500',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'github-dark': {
    background: 'bg-gray-900',
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-purple-400',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'nord': {
    background: 'bg-blue-900',
    string: 'text-green-300',
    number: 'text-blue-300',
    boolean: 'text-yellow-300',
    null: 'text-red-300',
    key: 'text-purple-300',
    size: 'text-gray-400',
    type: 'text-gray-400',
    group: 'text-gray-400',
  },
  'material-palenight': {
    background: 'bg-indigo-900',
    string: 'text-green-300',
    number: 'text-orange-300',
    boolean: 'text-yellow-300',
    null: 'text-red-300',
    key: 'text-blue-300',
    size: 'text-gray-400',
    type: 'text-gray-400',
    group: 'text-gray-400',
  },
  'ayu-dark': {
    background: 'bg-gray-900',
    string: 'text-green-400',
    number: 'text-orange-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-blue-400',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'tokyo-night': {
    background: 'bg-blue-900',
    string: 'text-teal-300',
    number: 'text-pink-300',
    boolean: 'text-purple-300',
    null: 'text-red-300',
    key: 'text-blue-300',
    size: 'text-gray-400',
    type: 'text-gray-400',
    group: 'text-gray-400',
  },
  'gruvbox-dark': {
    background: 'bg-yellow-900',
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-orange-400',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  'solarized-light': {
    background: 'bg-yellow-100',
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-yellow-600',
    null: 'text-red-600',
    key: 'text-cyan-600',
    size: 'text-gray-600',
    type: 'text-gray-600',
    group: 'text-gray-600',
  },
  'github-light': {
    background: 'bg-white',
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-yellow-600',
    null: 'text-red-600',
    key: 'text-purple-600',
    size: 'text-gray-600',
    type: 'text-gray-600',
    group: 'text-gray-600',
  },
  'atom-one-light': {
    background: 'bg-gray-100',
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-yellow-600',
    null: 'text-red-600',
    key: 'text-purple-600',
    size: 'text-gray-600',
    type: 'text-gray-600',
    group: 'text-gray-600',
  },
  'ayu-light': {
    background: 'bg-orange-50',
    string: 'text-green-600',
    number: 'text-orange-600',
    boolean: 'text-yellow-600',
    null: 'text-red-600',
    key: 'text-blue-600',
    size: 'text-gray-600',
    type: 'text-gray-600',
    group: 'text-gray-600',
  },
  'gruvbox-light': {
    background: 'bg-yellow-100',
    string: 'text-green-700',
    number: 'text-blue-700',
    boolean: 'text-yellow-700',
    null: 'text-red-700',
    key: 'text-orange-700',
    size: 'text-gray-700',
    type: 'text-gray-700',
    group: 'text-gray-700',
  },
  'high-contrast': {
    background: 'bg-black',
    string: 'text-white',
    number: 'text-yellow-300',
    boolean: 'text-yellow-300',
    null: 'text-yellow-300',
    key: 'text-white',
    size: 'text-white',
    type: 'text-white',
    group: 'text-white',
  },
  'cyberpunk': {
    background: 'bg-purple-900',
    string: 'text-green-400',
    number: 'text-pink-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-blue-400',
    size: 'text-gray-400',
    type: 'text-gray-400',
    group: 'text-gray-400',
  },
  'synthwave': {
    background: 'bg-pink-900',
    string: 'text-green-300',
    number: 'text-blue-300',
    boolean: 'text-yellow-300',
    null: 'text-red-300',
    key: 'text-purple-300',
    size: 'text-gray-400',
    type: 'text-gray-400',
    group: 'text-gray-400',
  },
  'pastel': {
    background: 'bg-pink-100',
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-yellow-400',
    null: 'text-red-400',
    key: 'text-purple-400',
    size: 'text-gray-500',
    type: 'text-gray-500',
    group: 'text-gray-500',
  },
  // Add more themes as needed
}

export default function JSONViewerEditor() {
  const [jsonInput, setJsonInput] = useState<string>('')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [theme, setTheme] = useState<keyof typeof themes>('monokai')
  const [iconStyle, setIconStyle] = useState<'triangle' | 'circle' | 'square' | 'arrow'>('triangle')
  const [indentWidth, setIndentWidth] = useState<0 | 1 | 2 | 3 | 4>(2)
  const [collapseBranches, setCollapseBranches] = useState<"don't collapse" | "collapse all" | "collapse after one branch" | "collapse after two branches">("don't collapse")
  const [collapseStringsAfterLength, setCollapseStringsAfterLength] = useState<number>(50)
  const [groupArraysAfterLength, setGroupArraysAfterLength] = useState<number>(100)
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(true)
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(true)
  const [enableClipboard, setEnableClipboard] = useState<boolean>(true)
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [enableDelete, setEnableDelete] = useState<boolean>(false)
  const [enableAdd, setEnableAdd] = useState<boolean>(false)

  useEffect(() => {
    try {
      if (jsonInput) {
        const parsed = JSON.parse(jsonInput)
        setParsedJson(parsed)
        setError('')
      } else {
        setParsedJson(null)
      }
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
      setParsedJson(null)
    }
  }, [jsonInput])

  const handleEdit = (path: string[], value: any) => {
    const newData = JSON.parse(JSON.stringify(parsedJson))
    let current = newData
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = value
    setJsonInput(JSON.stringify(newData, null, 2))
  }

  const handleDelete = (path: string[]) => {
    const newData = JSON.parse(JSON.stringify(parsedJson))
    let current = newData
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    if (Array.isArray(current)) {
      current.splice(parseInt(path[path.length - 1]), 1)
    } else {
      delete current[path[path.length - 1]]
    }
    setJsonInput(JSON.stringify(newData, null, 2))
  }

  const handleAdd = (path: string[], key: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(parsedJson))
    let current = newData
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]]
    }
    if (Array.isArray(current)) {
      current.push(value)
    } else {
      current[key] = value
    }
    setJsonInput(JSON.stringify(newData, null, 2))
  }

  return (
    <ToolLayout
      title="JSON Tree Viewer and Editor"
      description="A powerful tool to view, edit, and format JSON data with customizable options."
    >
      <Toaster position="top-right" />
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter raw JSON data..."
          className="w-full h-40 mb-4 bg-gray-700 text-white border-gray-600 rounded-md p-2"
        />
        
        <div className="flex space-x-2 mb-4">
          <Button onClick={() => setJsonInput('')} variant="destructive" className="bg-gray-700 text-white border-gray-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => {
            const element = document.createElement('a')
            const file = new Blob([jsonInput], {type: 'application/json'})
            element.href = URL.createObjectURL(file)
            element.download = 'data.json'
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          }} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {parsedJson && (
          <div className={`rounded-md p-4 border border-gray-700 overflow-auto max-h-[600px] ${themes[theme].background}`}>
            <TreeView
              data={parsedJson}
              theme={themes[theme]}
              iconStyle={iconStyle}
              indentWidth={indentWidth}
              collapseBranches={collapseBranches}
              collapseStringsAfterLength={collapseStringsAfterLength}
              groupArraysAfterLength={groupArraysAfterLength}
              displayObjectSize={displayObjectSize}
              displayDataTypes={displayDataTypes}
              enableClipboard={enableClipboard}
              enableEdit={enableEdit}
              enableDelete={enableDelete}
              enableAdd={enableAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="theme" className="text-white mb-2 block">Theme</Label>
            <Select value={theme} onValueChange={(value) => setTheme(value as keyof typeof themes)}>
              <SelectTrigger id="theme" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600 h-40 overflow-y-auto">
                {Object.keys(themes).map((themeName) => (
                  <SelectItem key={themeName} value={themeName}>{themeName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="icon-style" className="text-white mb-2 block">Icon Style</Label>
            <Select value={iconStyle} onValueChange={(value) => setIconStyle(value as 'triangle' | 'circle')}>
              <SelectTrigger id="icon-style" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select icon style" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="indent-width" className="text-white mb-2 block">Indent Width</Label>
            <Select value={indentWidth.toString()} onValueChange={(value) => setIndentWidth(Number(value) as 0 | 1 | 2 | 3 | 4)}>
              <SelectTrigger id="indent-width" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select indent width" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                {[0, 1, 2, 3, 4].map((width) => (
                  <SelectItem key={width} value={width.toString()}>{width}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="collapse-branches" className="text-white mb-2 block">Collapse Branches</Label>
            <Select value={collapseBranches} onValueChange={(value) => setCollapseBranches(value as "don't collapse" | "collapse all" | "collapse after one branch" | "collapse after two branches")}>
              <SelectTrigger id="collapse-branches" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select collapse option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="don't collapse">Don't Collapse</SelectItem>
                <SelectItem value="collapse all">Collapse All</SelectItem>
                <SelectItem value="collapse after one branch">Collapse After One Branch</SelectItem>
                <SelectItem value="collapse after two branches">Collapse After Two Branches</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="group-arrays" className="text-white mb-2 block">Group Arrays After Length</Label>
            <Select 
              value={groupArraysAfterLength.toString()} 
              onValueChange={(value) => setGroupArraysAfterLength(Number(value))}
            >
              <SelectTrigger id="group-arrays" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select group length" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                {[10, 50, 100, 500, 1000].map((length) => (
                  <SelectItem key={length} value={length.toString()}>{length}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="collapse-strings" className="text-white mb-2 block">Collapse Strings After Length</Label>
            <Select 
              value={collapseStringsAfterLength.toString()} 
              onValueChange={(value) => setCollapseStringsAfterLength(Number(value))}
            >
              <SelectTrigger id="collapse-strings" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select collapse length" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                {[0, 5, 10, 15, 20].map((length) => (
                  <SelectItem key={length} value={length.toString()}>{length}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="display-object-size"
              checked={displayObjectSize}
              onCheckedChange={setDisplayObjectSize}
            />
            <Label htmlFor="display-object-size" className="text-white">Display Object Size</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="display-data-types"
              checked={displayDataTypes}
              onCheckedChange={setDisplayDataTypes}
            />
            <Label htmlFor="display-data-types" className="text-white">Display Data Types</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-clipboard"
              checked={enableClipboard}
              onCheckedChange={setEnableClipboard}
            />
            <Label htmlFor="enable-clipboard" className="text-white">Enable Clipboard</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-edit"
              checked={enableEdit}
              onCheckedChange={setEnableEdit}
            />
            <Label htmlFor="enable-edit" className="text-white">Enable Edit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-delete"
              checked={enableDelete}
              onCheckedChange={setEnableDelete}
            />
            <Label htmlFor="enable-delete" className="text-white">Enable Delete</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-add"
              checked={enableAdd}
              onCheckedChange={setEnableAdd}
            />
            <Label htmlFor="enable-add" className="text-white">Enable Add</Label>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        What is the JSON File Viewer?
      </h2>
      <p className="text-gray-300 mb-4">
        Imagine you're a developer with a magical magnifying glass that can instantly make sense of complex data structures. That's essentially what our <Link href="#how-to-use" className="text-blue-400 hover:underline">JSON File Viewer</Link> does! It's a powerful and intuitive tool that lets you visualize, navigate, and edit JSON data with ease. Whether you're debugging an API response, analyzing data structures, or simply trying to make sense of a complex JSON file, this tool is your new best friend.
      </p>
      <p className="text-gray-300 mb-4">
        With the JSON File Viewer, you can transform intimidating text blobs into neatly organized, collapsible trees. You can edit values on the fly, add new properties, delete unnecessary ones, and even apply different color themes to make your JSON data pop! It's like having a Swiss Army knife for JSON manipulation.
      </p>

      <div className="my-8">
        <Image 
          src="/Images/JsonTreeViewer.png?height=400&width=600" 
          alt="Screenshot of the JSON File Viewer interface showing a sample JSON structure with expanded nodes" 
          width={600} 
          height={400} 
          className="rounded-lg shadow-lg"
        />
      </div>

      <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" />
        How to Use the JSON File Viewer
      </h2>
      <p className="text-gray-300 mb-4">
        Using our JSON File Viewer is as easy as parsing a simple object. Here's a step-by-step guide to get you started:
      </p>
      <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>First, paste your JSON data into the input area. Don't worry if it's not perfectly formatted - we'll take care of that for you!</li>
        <li>Hit the <strong>Parse</strong> button or let it auto-parse. Watch as your JSON transforms into a beautiful, interactive tree structure.</li>
        <li>Now, let's explore the <strong>Customization</strong> options:
          <ul className="list-disc list-inside ml-6 mt-2">
            <li><Link href="#theme" className="text-blue-400 hover:underline">Theme</Link>: Choose from a variety of color schemes to suit your mood or match your project's style.</li>
            <li><Link href="#icon-style" className="text-blue-400 hover:underline">Icon Style</Link>: Pick between triangle or circle icons for your collapsible nodes.</li>
            <li><Link href="#indent-width" className="text-blue-400 hover:underline">Indent Width</Link>: Adjust the indentation to your liking.</li>
            <li><Link href="#collapse-options" className="text-blue-400 hover:underline">Collapse Options</Link>: Decide how you want your JSON tree to be initially displayed.</li>
          </ul>
        </li>
        <li>Want to edit a value? Just click on it and start typing. It's like editing a document, but for your JSON data!</li>
        <li>Need to add a new property or array item? Look for the <strong>+</strong> button and click it to expand your JSON structure.</li>
        <li>Got some data you don't need? The <strong>Delete</strong> button is your friend. One click, and it's gone!</li>
        <li>Curious about the size of an object or array? Toggle the <strong>"Display Object Size"</strong> option and get instant insights.</li>
        <li>Want to know the data types at a glance? Enable <strong>"Display Data Types"</strong> and become a JSON wizard.</li>
        <li>Need to share your JSON? Hit that <strong>"Copy to Clipboard"</strong> button and paste it wherever you need.</li>
        <li>Made a mess? No worries! The <strong>Reset</strong> button is like a time machine for your JSON. One click, and you're back to where you started.</li>
      </ol>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" />
        Features That'll Make You Go "JSON-tastic!"
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li><Code className="inline-block w-4 h-4 mr-1" /> Syntax highlighting: Your JSON will look so good, you'll want to frame it.</li>
        <li><Eye className="inline-block w-4 h-4 mr-1" /> Collapsible nodes: Expand and collapse objects and arrays with a single click.</li>
        <li><Edit className="inline-block w-4 h-4 mr-1" /> In-place editing: Change values faster than you can say "key-value pair".</li>
        <li><Trash className="inline-block w-4 h-4 mr-1" /> Easy deletion: Remove nodes quicker than you can remove a splinter.</li>
        <li><Plus className="inline-block w-4 h-4 mr-1" /> Quick add: Insert new properties or items without breaking a sweat.</li>
        <li><Paintbrush className="inline-block w-4 h-4 mr-1" /> Multiple themes: Because your JSON deserves to dress up sometimes.</li>
        <li><Eye className="inline-block w-4 h-4 mr-1" /> Data type display: Know your strings from your numbers at a glance.</li>
        <li><Code className="inline-block w-4 h-4 mr-1" /> One-click copy: Copy your entire JSON or just a specific node in seconds.</li>
        <li><Download className="inline-block w-4 h-4 mr-1" /> Export functionality: Save your JSON file with all your edits intact.</li>
        <li><RefreshCw className="inline-block w-4 h-4 mr-1" /> Auto-refresh: See your changes reflected in real-time.</li>
        <li>Responsive design: Whether you're on a massive monitor or a tiny tablet, our viewer adapts perfectly.</li>
      </ul>
      <p className="text-gray-300 mt-4">
        So, what are you waiting for? Dive in, start viewing, and let your JSON data shine! Who knows? You might just discover patterns and insights you never noticed before. And remember, in the world of JSON File Viewer, there are no complex structures, only opportunities for beautiful visualization!
      </p>
    </div>
    </ToolLayout>
  )
}