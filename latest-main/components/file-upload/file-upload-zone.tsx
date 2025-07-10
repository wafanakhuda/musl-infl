"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Upload, X, ImageIcon, File, CheckCircle, AlertCircle, Camera } from "lucide-react"
import { toast } from "../../hooks/use-toast"
import { apiClient } from "../../lib/api-client"

interface FileUploadZoneProps {
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  uploadType: "avatar" | "portfolio" | "document" | "campaign-asset"
  className?: string
}

interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

export function FileUploadZone({
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = ["image/*", "application/pdf"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  uploadType,
  className = "",
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsDragging(false)

      // Validate file count
      if (files.length + acceptedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        })
        return
      }

      // Create initial file objects
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: "",
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: "uploading" as const,
      }))

      setFiles((prev) => [...prev, ...newFiles])

      // Upload files one by one
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const fileObj = newFiles[i]

        try {
          await uploadFile(file, fileObj)
        } catch (error) {
          console.error("Upload failed:", error)
          updateFileStatus(fileObj.id, "error", error instanceof Error ? error.message : "Upload failed")
        }
      }
    },
    [files.length, maxFiles, uploadType],
  )

  const uploadFile = async (file: File, fileObj: UploadedFile) => {
    try {
      let response

      // Different upload endpoints based on type
      switch (uploadType) {
        case "avatar":
          response = await apiClient.uploadAvatar(file)
          break
        case "portfolio":
          response = await apiClient.uploadPortfolioItem(file, file.name, "")
          break
        case "document":
          response = await uploadDocument(file, fileObj)
          break
        case "campaign-asset":
          response = await uploadCampaignAsset(file, fileObj)
          break
        default:
          throw new Error("Invalid upload type")
      }

      // Update file with success
      updateFileStatus(fileObj.id, "completed", undefined, response.file_url || response.avatar_url)

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete([
          {
            ...fileObj,
            url: response.file_url || response.avatar_url,
            status: "completed",
          },
        ])
      }
    } catch (error) {
      updateFileStatus(fileObj.id, "error", error instanceof Error ? error.message : "Upload failed")
      if (onUploadError) {
        onUploadError(error instanceof Error ? error.message : "Upload failed")
      }
    }
  }

  const uploadDocument = async (file: File, fileObj: UploadedFile) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload/document", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Document upload failed")
    }

    return response.json()
  }

  const uploadCampaignAsset = async (file: File, fileObj: UploadedFile) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload/campaign-asset", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Campaign asset upload failed")
    }

    return response.json()
  }

  const updateFileStatus = (
    fileId: string,
    status: "uploading" | "completed" | "error",
    error?: string,
    url?: string,
  ) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status,
              error,
              url: url || file.url,
              uploadProgress: status === "completed" ? 100 : file.uploadProgress,
            }
          : file,
      ),
    )
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const getUploadTypeLabel = () => {
    switch (uploadType) {
      case "avatar":
        return "Profile Picture"
      case "portfolio":
        return "Portfolio Item"
      case "document":
        return "Document"
      case "campaign-asset":
        return "Campaign Asset"
      default:
        return "File"
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <Card
        {...getRootProps()}
        className={`
          glass-card border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive || isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/20 hover:border-white/40"}
          ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} ref={fileInputRef} />
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-colors
              ${isDragActive || isDragging ? "bg-purple-500/20" : "bg-white/10"}
            `}
            >
              <Upload className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragActive ? `Drop ${getUploadTypeLabel()} here` : `Upload ${getUploadTypeLabel()}`}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop your files here, or <span className="text-purple-400 underline">browse</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                <span>Max {maxFiles} files</span>
                <span>•</span>
                <span>Up to {formatFileSize(maxFileSize)}</span>
                <span>•</span>
                <span>{acceptedFileTypes.join(", ")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Uploaded Files ({files.length})</h4>
          {files.map((file) => (
            <Card key={file.id} className="glass-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {file.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : file.status === "error" ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              file.status === "completed"
                                ? "border-green-500/30 text-green-300"
                                : file.status === "error"
                                  ? "border-red-500/30 text-red-300"
                                  : "border-yellow-500/30 text-yellow-300"
                            }
                          `}
                        >
                          {file.status === "completed" ? "Completed" : file.status === "error" ? "Failed" : "Uploading"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === "uploading" && <span>{file.uploadProgress}%</span>}
                    </div>
                    {file.status === "uploading" && <Progress value={file.uploadProgress} className="mt-2 h-1" />}
                    {file.status === "error" && file.error && <p className="text-xs text-red-400 mt-1">{file.error}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button (Alternative) */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
          className="border-white/20 hover:bg-white/5"
        >
          <Camera className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>
    </div>
  )
}