"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { Crop, RotateCw, ZoomIn, ZoomOut, Download, X } from "lucide-react"
import { toast } from "../../hooks/use-toast"

interface ImageCropperProps {
  imageUrl: string
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
  aspectRatio?: number
  cropShape?: "rect" | "round"
  className?: string
}

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  cropShape = "rect",
  className = "",
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y })
    },
    [crop],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      setCrop((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(newX, 400 - prev.width)),
        y: Math.max(0, Math.min(newY, 400 - prev.height)),
      }))
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getCroppedImage = useCallback(async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const image = imageRef.current

      if (!canvas || !image) {
        reject(new Error("Canvas or image not found"))
        return
      }

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Set canvas size
      canvas.width = crop.width
      canvas.height = crop.height

      // Apply transformations
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom, zoom)

      // Draw the cropped image
      ctx.drawImage(
        image,
        crop.x - canvas.width / 2,
        crop.y - canvas.height / 2,
        crop.width,
        crop.height,
        -crop.width / 2,
        -crop.height / 2,
        crop.width,
        crop.height,
      )

      ctx.restore()

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob"))
          }
        },
        "image/jpeg",
        0.9,
      )
    })
  }, [crop, zoom, rotation])

  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImage()
      onCropComplete(croppedBlob)
      toast({
        title: "Success",
        description: "Image cropped successfully!",
      })
    } catch (error) {
      console.error("Crop failed:", error)
      toast({
        title: "Error",
        description: "Failed to crop image",
        variant: "destructive",
      })
    }
  }

  const resetCrop = () => {
    setCrop({ x: 0, y: 0, width: 200, height: 200 })
    setZoom(1)
    setRotation(0)
  }

  return (
    <Card className={`glass-card border-white/10 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Crop Image
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              {cropShape === "round" ? "Circle" : "Rectangle"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div className="relative">
          <div
            className="relative w-full h-96 bg-black/20 rounded-lg overflow-hidden border border-white/10"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl || "/placeholder.svg"}
              alt="Crop preview"
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "center",
              }}
            />

            {/* Crop Overlay */}
            <div
              className={`
                absolute border-2 border-purple-500 cursor-move
                ${cropShape === "round" ? "rounded-full" : "rounded"}
              `}
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Crop handles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full cursor-nw-resize" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full cursor-ne-resize" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full cursor-sw-resize" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full cursor-se-resize" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Zoom</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className="text-gray-400 hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="text-gray-400 hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Rotation</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation((rotation - 90) % 360)}
                  className="text-gray-400 hover:text-white"
                >
                  <RotateCw className="w-4 h-4 transform scale-x-[-1]" />
                </Button>
                <span className="text-xs text-gray-400 w-12 text-center">{rotation}°</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="text-gray-400 hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={0}
              max={360}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetCrop} className="border-white/20 hover:bg-white/5">
            Reset
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="border-white/20 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleCropComplete} className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
