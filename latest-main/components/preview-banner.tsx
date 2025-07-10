"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Button } from "../components/ui/button"
import { X, Info } from "lucide-react"
import { shouldShowPreviewBanner } from "../lib/env-fallback"

export function PreviewBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(shouldShowPreviewBanner())
  }, [])

  if (!isVisible) return null

  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 rounded-none border-x-0 border-t-0">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="font-medium">Preview Mode:</span>
          <span>Using mock data - Backend API not connected. All features are functional for demonstration.</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-800 hover:text-blue-900 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
