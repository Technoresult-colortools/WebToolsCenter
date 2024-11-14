import React, { useState, useEffect, useCallback } from 'react'
import { ChevronRight, ChevronDown, ChevronUp, MoreHorizontal, Clipboard, Pencil,Check, X, Plus, Circle, Square, ArrowRight, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }
type DataType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'undefined' | 'function'



interface TreeViewProps {
  data: JSONValue
  theme: {
    background: string
    string: string
    number: string
    boolean: string
    null: string
    key: string
    size: string
    type: string
    group: string
  }
  iconStyle: 'triangle' | 'circle' | 'square' | 'arrow'
  indentWidth: 0 | 1 | 2 | 3 | 4
  collapseBranches: "don't collapse" | "collapse all" | "collapse after one branch" | "collapse after two branches"
  collapseStringsAfterLength: number
  groupArraysAfterLength: number
  displayObjectSize: boolean
  displayDataTypes: boolean
  enableClipboard: boolean
  enableAdd: boolean
  enableEdit: boolean
  enableDelete: boolean
  onEdit: (path: string[], key: string | null, value: JSONValue) => void
  onDelete: (path: string[]) => void
  onAdd: (path: string[], key: string, value: JSONValue) => void
}

interface EditState {
  path: string[]
  key: string | null
  value: string
}

interface AddState {
  path: string[]
  key: string
  value: string
}

interface ArrayGroup {
  start: number
  end: number
  items: JSONValue[]
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'ghost' | 'default', size?: 'sm' | 'md' }> = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'md', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantClasses = variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
  const sizeClasses = size === 'sm' ? 'h-9 px-3 text-xs' : 'h-10 py-2 px-4'
  
  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export default function JSONTreeViewer({
    data,
    theme,
    iconStyle,
    indentWidth,
    collapseBranches,
    collapseStringsAfterLength,
    groupArraysAfterLength,
    displayObjectSize,
    displayDataTypes,
    enableClipboard,
    enableAdd,
    enableEdit,
    enableDelete,
    onEdit,
    onDelete,
    onAdd
  }: TreeViewProps): React.ReactElement | null {
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
    const [expandedStrings, setExpandedStrings] = useState<Set<string>>(new Set())
    const [editState, setEditState] = useState<EditState | null>(null)
    const [addState, setAddState] = useState<AddState | null>(null)
  
    const initializeExpanded = useCallback((): Set<string> => {
      if (collapseBranches === 'collapse all') {
        return new Set()
      } else if (collapseBranches === "don't collapse") {
        return new Set(getAllPaths(data))
      } else {
        return new Set(getCollapsedPaths(data, collapseBranches === "collapse after one branch" ? 1 : 2))
      }
    }, [collapseBranches, data])
  
    useEffect(() => {
      setExpanded(initializeExpanded())
    }, [initializeExpanded])

  const getAllPaths = (obj: JSONValue, path: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null) return []
    const currentPath = path.join('.')
    const childPaths = Object.entries(obj).flatMap(([key, value]) => 
      getAllPaths(value, [...path, key])
    )
    return currentPath ? [currentPath, ...childPaths] : childPaths
  }

  const getCollapsedPaths = (obj: JSONValue, maxDepth: number, path: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null || path.length >= maxDepth) return []
    const currentPath = path.join('.')
    const childPaths = Object.entries(obj).flatMap(([key, value]) => 
      getCollapsedPaths(value, maxDepth, [...path, key])
    )
    return currentPath ? [currentPath, ...childPaths] : childPaths
  }

  const toggleExpand = (path: string[]) => {
    const pathString = path.join('.')
    setExpanded(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(pathString)) {
        newExpanded.delete(pathString)
      } else {
        newExpanded.add(pathString)
      }
      return newExpanded
    })
  }

  const toggleExpandGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const newExpandedGroups = new Set(prev)
      if (newExpandedGroups.has(groupKey)) {
        newExpandedGroups.delete(groupKey)
      } else {
        newExpandedGroups.add(groupKey)
      }
      return newExpandedGroups
    })
  }

  const toggleExpandString = (path: string[]) => {
    const pathString = path.join('.')
    setExpandedStrings(prev => {
      const newExpandedStrings = new Set(prev)
      if (newExpandedStrings.has(pathString)) {
        newExpandedStrings.delete(pathString)
      } else {
        newExpandedStrings.add(pathString)
      }
      return newExpandedStrings
    })
  }

  const createArrayGroups = (array: JSONValue[]): ArrayGroup[] => {
    const groups: ArrayGroup[] = []
    for (let i = 0; i < array.length; i += groupArraysAfterLength) {
      const end = Math.min(i + groupArraysAfterLength - 1, array.length - 1)
      groups.push({
        start: i,
        end: end,
        items: array.slice(i, end + 1)
      })
    }
    return groups
  }

  const renderActions = (value: JSONValue, path: string[], key: string | null) => (
    <div className="inline-flex items-center gap-1 ml-2">
      {enableClipboard && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            navigator.clipboard.writeText(JSON.stringify(value, null, 2))
            toast.success('Copied to clipboard')
          }}
        >
          <Clipboard className="w-4 h-4" />
        </Button>
      )}
      {enableEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            setEditState({ 
              path, 
              key,
              value: typeof value === 'string' ? value : JSON.stringify(value)
            })
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      {enableDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(path)
          }}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  )

  const renderIcon = (isExpanded: boolean) => {
    switch (iconStyle) {
      case 'circle':
        return isExpanded ? <Circle className="w-4 h-4 mr-1 text-gray-400" /> : <Circle className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" />
      case 'square':
        return isExpanded ? <Square className="w-4 h-4 mr-1 text-gray-400" /> : <Square className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" />
      case 'arrow':
        return isExpanded ? <ChevronDown className="w-4 h-4 mr-1 text-gray-400" /> : <ArrowRight className="w-4 h-4 mr-1 text-gray-400" />
      case 'triangle':
      default:
        return isExpanded ? <ChevronDown className="w-4 h-4 mr-1 text-gray-400" /> : <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
    }
  }

  const renderArrayGroup = (group: ArrayGroup, path: string[]) => {
    const groupKey = `${path.join('.')}-${group.start}-${group.end}`
    const isGroupExpanded = expandedGroups.has(groupKey)

    return (
      <div key={groupKey} className="ml-4">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-800 rounded px-1"
          onClick={() => toggleExpandGroup(groupKey)}
        >
          {renderIcon(isGroupExpanded)}
          <span className={theme.group}>[{group.start} ... {group.end}]</span>
        </div>
        {isGroupExpanded && (
          <div className="ml-4">
            {group.items.map((item, index) => (
              <div key={group.start + index} className="my-1">
                {renderValue(item, [...path, (group.start + index).toString()], (group.start + index).toString())}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderValue = (value: JSONValue, path: string[], key: string | null = null): React.ReactElement | null => {
    const pathString = path.join('.')
    const isExpanded = expanded.has(pathString)

    const renderDataType = () => {
      if (!displayDataTypes) return null
      let type: DataType = typeof value as DataType
      if (Array.isArray(value)) type = 'array'
      else if (value === null) type = 'null'
      return <span className={theme.type}>({type})</span>
    }

    const renderSize = () => {
      if (!displayObjectSize || typeof value !== 'object' || value === null) return null
      const size = Array.isArray(value) ? value.length : Object.keys(value).length
      return <span className={theme.size}>{size} items</span>
    }

    const renderKeyValue = () => {
      if (key === null) return null
      return (
        <span className={theme.key}>
          {key}:&nbsp;
        </span>
      )
    }

    const renderEditForm = () => {
      if (!editState || editState.path.join('.') !== pathString) return null

      return (
        <div className="flex items-center gap-2 mt-2">
          {editState.key !== null && (
            <Input
              value={editState.key}
              onChange={(e) => setEditState({ ...editState, key: e.target.value })}
              placeholder="Key"
              className="w-32 text-sm"
            />
          )}
          <Input
            value={editState.value}
            onChange={(e) => setEditState({ ...editState, value: e.target.value })}
            placeholder="Value (JSON)"
            className="w-48 text-sm"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              try {
                const newValue = JSON.parse(editState.value)
                onEdit(path, editState.key, newValue)
                setEditState(null)
              } catch (err) {
                toast.error('Invalid JSON value')
              }
            }}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditState(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    if (value === null) {
      return (
        <div className="flex items-center">
          {renderKeyValue()}
          <span className={theme.null}>null</span>
          {renderActions(value, path, key)}
          {renderEditForm()}
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center">
          {renderKeyValue()}
          <span className={theme.boolean}>{value.toString()}</span>
          {renderActions(value, path, key)}
          {renderEditForm()}
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div className="flex items-center">
          {renderKeyValue()}
          <span className={theme.number}>{value}</span>
          {renderActions(value, path, key)}
          {renderEditForm()}
        </div>
      )
    }

    if (typeof value === 'string') {
      const isExpanded = expandedStrings.has(pathString)
      const shouldCollapse = collapseStringsAfterLength && value.length > collapseStringsAfterLength
      const displayValue = shouldCollapse && !isExpanded
        ? value.slice(0, collapseStringsAfterLength)
        : value

      return (
        <div className="flex items-center">
          {renderKeyValue()}
          <span className={theme.string}>
            "{displayValue}{shouldCollapse && !isExpanded ? '...' : ''}"
            {shouldCollapse && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpandString(path)
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <MoreHorizontal className="w-3 h-3" />
                )}
              </Button>
            )}
          </span>
          {renderActions(value, path, key)}
          {renderEditForm()}
        </div>
      )
    }

    if (typeof value === 'object' && value !== null) {
        const isArray = Array.isArray(value)
  
        return (
          <div className="relative" style={{ marginLeft: key !== null ? 0 : `${indentWidth * 8}px` }}>
            <div
              className="flex items-center cursor-pointer hover:bg-gray-800 rounded px-1"
              onClick={() => toggleExpand(path)}
            >
              {renderIcon(isExpanded)}
              {renderKeyValue()}
              <span>{isArray ? '[' : '{'}</span>
              {renderSize()}
              {renderDataType()}
              <span>{!isExpanded && (isArray ? ']' : '}')}</span>
              {renderActions(value, path, key)}
            </div>
            {isExpanded && (
              <div className="ml-4">
                {isArray ? (
                  groupArraysAfterLength && value.length > groupArraysAfterLength ? (
                    createArrayGroups(value).map(group => renderArrayGroup(group, path))
                  ) : (
                    value.map((item, index) => (
                      <div key={index} className="my-1">
                        {renderValue(item, [...path, index.toString()], index.toString())}
                      </div>
                    ))
                  )
                ) : (
                  Object.entries(value).map(([itemKey, itemValue]) => (
                    <div key={itemKey} className="my-1">
                      {renderValue(itemValue, [...path, itemKey], itemKey)}
                    </div>
                  ))
                )}
                {enableAdd && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-4 mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddState({
                        path,
                        key: isArray ? value.length.toString() : '',
                        value: ''
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add {isArray ? 'item' : 'property'}
                  </Button>
                )}
                {addState && addState.path.join('.') === pathString && (
                  <div className="flex items-center gap-2 mt-2 ml-8">
                    {!isArray && (
                      <Input
                        value={addState.key}
                        onChange={(e) => setAddState({ ...addState, key: e.target.value })}
                        placeholder="Key"
                        className="w-32 text-sm"
                      />
                    )}
                    <Input
                      value={addState.value}
                      onChange={(e) => setAddState({ ...addState, value: e.target.value })}
                      placeholder="Value (JSON)"
                      className="w-48 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        try {
                          const newValue = JSON.parse(addState.value)
                          onAdd(path, addState.key, newValue)
                          setAddState(null)
                        } catch (err) {
                          toast.error('Invalid JSON value')
                        }
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAddState(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            {isExpanded && <div>{isArray ? ']' : '}'}</div>}
          </div>
        )
      }
  
      return null
    }
  
    return (
      <div 
        className={`font-mono text-sm p-4 rounded-lg ${theme.background}`}
        style={{ maxWidth: '100%', overflowX: 'auto' }}
      >
        {renderValue(data, [])}
      </div>
    )

}