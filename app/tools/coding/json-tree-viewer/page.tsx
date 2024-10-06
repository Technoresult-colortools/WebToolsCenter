'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Download, ChevronRight, ChevronDown, Edit, Trash, Plus, Check, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }
type ThemeName = keyof typeof themes;

interface TreeViewProps {
  data: JSONValue
  theme: {
    background: string;
    string: string;
    number: string;
    boolean: string;
    null: string;
    key: string;
    size: string;
    type: string;
    group: string;
  };
  iconStyle: string
  indentWidth: number
  collapseBranches: string
  collapseStringsAfterLength: number
  groupArraysAfterLength: number
  displayObjectSize: boolean
  displayDataTypes: boolean
  enableEdit: boolean
  enableDelete: boolean
  enableAdd: boolean
  onEdit: (path: string[], value: JSONValue) => void
  onDelete: (path: string[]) => void
  onAdd: (path: string[], key: string, value: JSONValue) => void
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  theme,
  iconStyle,
  indentWidth,
  collapseBranches,
  collapseStringsAfterLength,
  groupArraysAfterLength,
  displayObjectSize,
  displayDataTypes,
  enableEdit,
  enableDelete,
  enableAdd,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [editingPath, setEditingPath] = useState<string[] | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [addingPath, setAddingPath] = useState<string[] | null>(null)
  const [addKey, setAddKey] = useState<string>('')
  const [addValue, setAddValue] = useState<string>('')

  useEffect(() => {
    if (collapseBranches === 'collapse all') {
      setExpanded(new Set())
    } else if (collapseBranches === 'expand all') {
      const allPaths = getAllPaths(data)
      setExpanded(new Set(allPaths))
    }
  }, [collapseBranches, data])

  const getAllPaths = (obj: JSONValue, path: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null) {
      return []
    }
    const currentPath = path.length > 0 ? path.join('.') : ''
    const childPaths = Object.entries(obj).flatMap(([key, value]) => 
      getAllPaths(value, [...path, key])
    )
    return currentPath ? [currentPath, ...childPaths] : childPaths
  }

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpanded(newExpanded)
  }

  const renderValue = (value: JSONValue, path: string[]): JSX.Element => {
    const pathString = path.join('.')
    const isExpanded = expanded.has(pathString)

    if (typeof value === 'string') {
      const displayValue = collapseStringsAfterLength && value.length > collapseStringsAfterLength
        ? `${value.slice(0, collapseStringsAfterLength)}...`
        : value
      return (
        <div className="flex items-center gap-2">
          <span className={theme.string}>
            "{displayValue}"
            {displayDataTypes && <span className={theme.type}> (string)</span>}
          </span>
          {renderActions(path, value)}
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div className="flex items-center gap-2">
          <span className={theme.number}>
            {value}
            {displayDataTypes && <span className={theme.type}> (number)</span>}
          </span>
          {renderActions(path, value)}
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center gap-2">
          <span className={theme.boolean}>
            {value.toString()}
            {displayDataTypes && <span className={theme.type}> (boolean)</span>}
          </span>
          {renderActions(path, value)}
        </div>
      )
    }

    if (value === null) {
      return (
        <div className="flex items-center gap-2">
          <span className={theme.null}>
            null
            {displayDataTypes && <span className={theme.type}> (null)</span>}
          </span>
          {renderActions(path, value)}
        </div>
      )
    }

    if (Array.isArray(value)) {
      return renderArray(value, path, isExpanded)
    }

    if (typeof value === 'object') {
      return renderObject(value, path, isExpanded)
    }

    return <span>Unknown type</span>
  }

  const renderActions = (path: string[], value: JSONValue) => {
    if (editingPath && editingPath.join('.') === path.join('.')) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-grow"
          />
          <Button variant="ghost" size="sm" onClick={() => handleSave(path)}>
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingPath(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        {enableEdit && (
          <Button variant="ghost" size="sm" onClick={() => handleEdit(path, value)}>
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {enableDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(path)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  const renderArray = (value: JSONValue[], path: string[], isExpanded: boolean) => {
    const shouldGroup = groupArraysAfterLength && value.length > groupArraysAfterLength

    return (
      <div>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => toggleExpand(path.join('.'))}
        >
          {iconStyle === 'triangle' ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <span>{isExpanded ? '▼' : '▶'}</span>
          )}
          <span className={theme.string}>
            [{displayObjectSize && <span className={theme.size}>{value.length}</span>}]
            {displayDataTypes && <span className={theme.type}> (array)</span>}
          </span>
          {renderActions(path, value)}
        </div>

        {isExpanded && (
          <div style={{ marginLeft: `${indentWidth * 8}px` }}>
            {shouldGroup
              ? renderGroupedArray(value, path)
              : renderFullArray(value, path)
            }
            {enableAdd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAdd(path)}
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderGroupedArray = (value: JSONValue[], path: string[]) => {
    return chunk(value, groupArraysAfterLength).map((group, groupIndex) => (
      <div key={groupIndex}>
        <span className={theme.group}>
          [{groupIndex * groupArraysAfterLength} - {Math.min((groupIndex + 1) * groupArraysAfterLength - 1, value.length - 1)}]
        </span>
        {group.map((item, index) => (
          <div key={index}>
            {renderValue(item, [...path, (groupIndex * groupArraysAfterLength + index).toString()])}
          </div>
        ))}
      </div>
    ))
  }

  const renderFullArray = (value: JSONValue[], path: string[]) => {
    return value.map((item, index) => (
      <div key={index}>
        {renderValue(item, [...path, index.toString()])}
      </div>
    ))
  }

  const renderObject = (value: { [key: string]: JSONValue }, path: string[], isExpanded: boolean) => {
    return (
      <div>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => toggleExpand(path.join('.'))}
        >
          {iconStyle === 'triangle' ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <span>{isExpanded ? '▼' : '▶'}</span>
          )}
          <span className={theme.string}>
            {'{'}
            {displayObjectSize && <span className={theme.size}>{Object.keys(value).length}</span>}
            {'}'}
            {displayDataTypes && <span className={theme.type}> (object)</span>}
          </span>
          {renderActions(path, value)}
        </div>

        {isExpanded && (
          <div style={{ marginLeft: `${indentWidth * 8}px` }}>
            {Object.entries(value).map(([key, val]) => (
              <div key={key} className="flex items-center">
                <span className={theme.key}>"{key}"</span>: {renderValue(val, [...path, key])}
              </div>
            ))}
            {enableAdd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAdd(path)}
              >
                <Plus className="w-4 h-4" /> Add Property
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  const handleEdit = (path: string[], value: JSONValue) => {
    setEditingPath(path)
    setEditValue(JSON.stringify(value))
  }

  const handleSave = (path: string[]) => {
    try {
      const parsedValue = JSON.parse(editValue)
      onEdit(path, parsedValue)
      setEditingPath(null)
    } catch (err) {
      toast.error('Invalid JSON input')
    }
  }

  const handleAdd = (path: string[]) => {
    setAddingPath(path)
    setAddKey('')
    setAddValue('')
  }

  const handleAddSave = () => {
    if (addingPath) {
      try {
        const parsedValue = JSON.parse(addValue)
        onAdd(addingPath, addKey, parsedValue)
        setAddingPath(null)
      } catch (err) {
        toast.error('Invalid JSON input')
      }
    }
  }

  return (
    <div className={`font-mono text-sm ${theme.background}`}>
      {renderValue(data, [])}
      {addingPath && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <Input
            placeholder="Key"
            value={addKey}
            onChange={(e) => setAddKey(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Value (JSON format)"
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleAddSave}>Add</Button>
          <Button variant="ghost" onClick={() => setAddingPath(null)}>Cancel</Button>
        </div>
      )}
    </div>
  )
}

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
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
  'one-dark': {
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
  'tomorrow-night': {
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
  'material-dark': {
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
  'nord-light': {
    background: 'bg-blue-100',
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-yellow-600',
    null: 'text-red-600',
    key: 'text-purple-600',
    size: 'text-gray-600',
    type: 'text-gray-600',
    group: 'text-gray-600',
  },
  'tomorrow': {
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
  'paper-light': {
    background: 'bg-yellow-50',
    string: 'text-green-700',
    number: 'text-blue-700',
    boolean: 'text-yellow-700',
    null: 'text-red-700',
    key: 'text-purple-700',
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
}

export default function JSONViewerEditor() {
  const [jsonInput, setJsonInput] = useState<string>('')
  const [parsedJson, setParsedJson] = useState<JSONValue | null>(null)
  const [error, setError] = useState<string>('')
  const [theme, setTheme] = useState<ThemeName>('monokai')
  const [iconStyle, setIconStyle] = useState<string>('triangle')
  const [indentWidth, setIndentWidth] = useState<number>(3)
  const [collapseBranches, setCollapseBranches] = useState<string>("don't collapse")
  const [collapseStringsAfterLength, setCollapseStringsAfterLength] = useState<number>(20)
  const [groupArraysAfterLength, setGroupArraysAfterLength] = useState<number>(100)
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false)
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false)
  const [enableAdd, setEnableAdd] = useState<boolean>(false)
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [enableDelete, setEnableDelete] = useState<boolean>(false)
  const [showTreeView, setShowTreeView] = useState<boolean>(false)

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

  const handleReset = () => {
    setJsonInput('')
    setParsedJson(null)
    setError('')
    setShowTreeView(false)
  }

  const handleDownload = () => {
    if (!jsonInput) {
      toast.error('No JSON data to download')
      return
    }
    const element = document.createElement('a')
    const file = new Blob([jsonInput], {type: 'application/json'})
    element.href = URL.createObjectURL(file)
    element.download = 'data.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('JSON file downloaded successfully')
  }

  const handleEdit = (path: string[], value: JSONValue) => {
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

  const handleThemeChange = (value: string) => {
    if (isValidTheme(value)) {
      setTheme(value);
    }
  };
  
  const isValidTheme = (value: string): value is ThemeName => {
    return Object.keys(themes).includes(value);
  };

  const handleAdd = (path: string[], key: string, value: JSONValue) => {
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

  const toggleTreeView = () => {
    setShowTreeView(!showTreeView)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">JSON Viewer and Editor</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter raw JSON data..."
            className="w-full h-40 mb-4 bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
          
          <div className="flex space-x-2 mb-4">
            <Button onClick={handleReset} variant="outline" className="bg-gray-700 text-white border-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={toggleTreeView} className="bg-blue-600 hover:bg-blue-700 text-white">
              {showTreeView ? 'Hide' : 'Show'} JSON Tree View
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {showTreeView && parsedJson && (
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
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  {(Object.keys(themes) as ThemeName[]).map((themeName) => (
                    <SelectItem key={themeName} value={themeName}>{themeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="icon-style" className="text-white mb-2 block">Icon Style</Label>
              <Select value={iconStyle} onValueChange={setIconStyle}>
                <SelectTrigger id="icon-style" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select icon style" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="triangle">Triangle</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="indent-width" className="text-white mb-2 block">Indent Width</Label>
              <Select value={indentWidth.toString()} onValueChange={(value) => setIndentWidth(Number(value))}>
                <SelectTrigger id="indent-width" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select indent width" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  {[1, 2, 3, 4, 5].map((tab) => (
                    <SelectItem key={tab} value={tab.toString()}>Tab {tab}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="collapse-branches" className="text-white mb-2 block">Collapse Branches</Label>
              <Select value={collapseBranches} onValueChange={setCollapseBranches}>
                <SelectTrigger id="collapse-branches" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select collapse option" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="don't collapse">Don't Collapse</SelectItem>
                  <SelectItem value="collapse all">Collapse All</SelectItem>
                  <SelectItem value="expand all">Expand All</SelectItem>
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
                  {[5, 10, 15, 20].map((length) => (
                    <SelectItem key={length} value={length.toString()}>{length}</SelectItem>
                  ))}
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
                  {[25, 50, 100, 250, 500, 1000, 2000].map((length) => (
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
                id="enable-add"
                checked={enableAdd}
                onCheckedChange={setEnableAdd}
              />
              <Label htmlFor="enable-add" className="text-white">Enable Add</Label>
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
          </div>

          <Button onClick={handleDownload} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download as JSON
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}