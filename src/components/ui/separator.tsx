
"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

// Lightweight Separator component that doesn't require @radix-ui/react-separator.
// It provides the same API shape used across the app (orientation + className).
const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    data-orientation={orientation}
    className={cn(
      "shrink-0 bg-border/50",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))

Separator.displayName = "Separator"

export { Separator }

    