import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export function Popover({ trigger, content, placement = 'bottom' }: PopoverProps) {
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
  }, [isOpen, placement])

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && createPortal(
        <div
          ref={contentRef}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4"
          style={{ minWidth: '200px' }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}