'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PopoverProps {
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface PopoverTriggerProps {
  children: ReactNode
}

interface PopoverContentProps {
  children: ReactNode
}

const PopoverContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
  placement: 'top' | 'bottom' | 'left' | 'right'
} | null>(null)

export function Popover({ children, placement = 'bottom' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentRef, placement }}>
      {children}
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('PopoverTrigger must be used within a Popover')
  }
  const { setIsOpen, triggerRef } = context

  return (
    <div ref={triggerRef} onClick={() => setIsOpen(prev => !prev)}>
      {children}
    </div>
  )
}

export function PopoverContent({ children }: PopoverContentProps) {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('PopoverContent must be used within a Popover')
  }
  const { isOpen, contentRef, triggerRef, placement } = context

  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - contentRect.height
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.left - contentRect.width
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.right
          break
      }

      contentRef.current.style.top = `${top}px`
      contentRef.current.style.left = `${left}px`
    }
  }, [isOpen, placement, triggerRef, contentRef])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={contentRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4"
      style={{ minWidth: '200px' }}
    >
      {children}
    </div>,
    document.body
  )
}