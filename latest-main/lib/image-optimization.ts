"use client"

// Image optimization utilities
import { useState, useEffect } from "react"

interface ImageOptimizationOptions {
  quality?: number
  format?: "webp" | "avif" | "auto"
  sizes?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export function getOptimizedImageUrl(
  src: string,
  width: number,
  height?: number,
  options: ImageOptimizationOptions = {},
): string {
  if (!src) return "/placeholder.svg"

  // If it's already a Next.js optimized image or external URL, return as-is
  if (src.startsWith("/_next/") || src.startsWith("http")) {
    return src
  }

  const params = new URLSearchParams()
  params.set("url", src)
  params.set("w", width.toString())

  if (height) {
    params.set("h", height.toString())
  }

  if (options.quality) {
    params.set("q", options.quality.toString())
  }

  if (options.format && options.format !== "auto") {
    params.set("f", options.format)
  }

  return `/_next/image?${params.toString()}`
}

// Progressive image loading hook
export function useProgressiveImage(src: string, placeholder?: string) {
  const [currentSrc, setCurrentSrc] = useState(placeholder || "/placeholder.svg")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()

    img.onload = () => {
      setCurrentSrc(src)
      setLoading(false)
    }

    img.onerror = () => {
      setError(true)
      setLoading(false)
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { src: currentSrc, loading, error }
}

// Lazy loading intersection observer hook
export function useLazyLoading(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold])

  return { isVisible, ref: setRef }
}

// Image compression utility
export async function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        "image/jpeg",
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Generate responsive image sizes
export function generateResponsiveSizes(breakpoints: number[] = [640, 768, 1024, 1280, 1536]) {
  return breakpoints
    .map((bp, index) => {
      if (index === breakpoints.length - 1) {
        return `${bp}px`
      }
      return `(max-width: ${bp}px) ${bp}px`
    })
    .join(", ")
}

// WebP support detection
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
  })
}

// AVIF support detection
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image()
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2)
    }
    avif.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A="
  })
}
