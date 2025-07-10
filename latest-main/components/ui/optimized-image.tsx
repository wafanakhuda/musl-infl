"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

import { usePerformanceMonitor } from "../../lib/performance-stub"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: "lazy" | "eager"
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
  objectPosition?: string
  quality?: number
  unoptimized?: boolean
  onLoadingComplete?: (image: HTMLImageElement) => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority,
  loading,
  placeholder,
  blurDataURL,
  objectFit,
  objectPosition,
  quality,
  unoptimized,
  onLoadingComplete,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const { start, end } = usePerformanceMonitor()

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoadingComplete = (image: HTMLImageElement) => {
    setIsLoaded(true)
    if (onLoadingComplete) {
      onLoadingComplete(image)
    }
    end("image-load")
  }

  useEffect(() => {
    start("image-load")
  }, [start])

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? "opacity-100" : "opacity-0 transition-opacity duration-500"}`}
      priority={priority}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      objectFit={objectFit}
      objectPosition={objectPosition}
      quality={quality}
      unoptimized={unoptimized}
      onLoadingComplete={handleLoadingComplete}
      ref={imageRef}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  )
}

export default OptimizedImage
