import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: React.ReactNode
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, children, pressed, onPressedChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        data-state={pressed ? "on" : "off"}
        onClick={() => onPressedChange(!pressed)}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-blue-600 data-[state=on]:text-white",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle }