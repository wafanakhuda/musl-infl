"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { FileUploadZone } from "./file-upload-zone"
import { ImageCropper } from "./image-cropper"
import { Plus, Edit, Trash2, Eye, ExternalLink, ImageIcon, Calendar, Tag } from "lucide-react"
import { toast } from "../../hooks/use-toast"
import { apiClient } from "../../lib/api-client"

interface PortfolioItem {
  id: string
  title: string
  description: string
  image_url: string
  tags: string[]
  created_at: string
  views: number
  likes: number
}

interface PortfolioManagerProps {
  userId?: string
  editable?: boolean
  className?: string
}

export function PortfolioManager({ userId, editable = true, className = "" }: PortfolioManagerProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    loadPortfolio()
  }, [userId])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      if (!userId) return
      const response = await apiClient.getCreatorPortfolio(userId)
      setPortfolioItems(response.portfolio_items || [])
    } catch (error) {
      console.error("Failed to load portfolio:", error)
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (files: any[]) => {
    if (files.length > 0) {
      setSelectedImage(files[0].url)
      setShowCropper(true)
    }
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert blob to file and upload
    const file = new File([croppedBlob], "portfolio-item.jpg", { type: "image/jpeg" })
    uploadPortfolioImage(file)
    setShowCropper(false)
  }

  const uploadPortfolioImage = async (file: File) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    try {
      const response = await apiClient.uploadPortfolioItem(file, title, description)
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      })
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    }
  }

  const savePortfolioItem = async (itemData: Partial<PortfolioItem>) => {
    try {
      if (editingItem) {
        // Update existing item
        const response = await apiClient.updatePortfolioItem(editingItem.id, itemData)
        setPortfolioItems((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...response } : item)))
        toast({
          title: "Success",
          description: "Portfolio item updated successfully!",
        })
      } else {
        // Create new item
        const response = await apiClient.createPortfolioItem({  
          title: itemData.title!,
          description: itemData.description!,
          file_url: itemData.image_url!,

        } )
        setPortfolioItems((prev) => [response, ...prev])
        toast({
          title: "Success",
          description: "Portfolio item created successfully!",
        })
      }

      setIsAddingItem(false)
      setEditingItem(null)
      setSelectedImage(null)
    } catch (error) {
      console.error("Save failed:", error)
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      })
    }
  }

  const deletePortfolioItem = async (itemId: string) => {
    try {
      await apiClient.deletePortfolioItem(itemId)
      setPortfolioItems((prev) => prev.filter((item) => item.id !== itemId))
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully!",
      })
    } catch (error) {
      console.error("Delete failed:", error)
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <PortfolioSkeleton />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Portfolio</h3>
          <p className="text-gray-400">Showcase your best work</p>
        </div>
        {editable && (
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add Portfolio Item</DialogTitle>
              </DialogHeader>
              <PortfolioItemForm
                item={editingItem}
                selectedImage={selectedImage}
                onImageUpload={handleImageUpload}
                onSave={savePortfolioItem}
                onCancel={() => {
                  setIsAddingItem(false)
                  setEditingItem(null)
                  setSelectedImage(null)
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Portfolio Grid */}
      {portfolioItems.length === 0 ? (
        <Card className="glass-card border-white/10">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Portfolio Items</h4>
            <p className="text-gray-400 mb-6">Start building your portfolio by adding your best work</p>
            {editable && (
              <Button onClick={() => setIsAddingItem(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioItemCard
              key={item.id}
              item={item}
              editable={editable}
              onEdit={() => {
                setEditingItem(item)
                setSelectedImage(item.image_url)
                setIsAddingItem(true)
              }}
              onDelete={() => deletePortfolioItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <Dialog open={showCropper} onOpenChange={setShowCropper}>
          <DialogContent className="max-w-4xl">
            <ImageCropper
              imageUrl={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
              aspectRatio={16 / 9}
              cropShape="rect"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function PortfolioItemCard({
  item,
  editable,
  onEdit,
  onDelete,
}: {
  item: PortfolioItem
  editable: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="glass-card border-white/10 group hover:border-purple-500/30 transition-all duration-200">
      <div className="relative">
        <img
          src={item.image_url || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <ExternalLink className="w-4 h-4" />
            </Button>
            {editable && (
              <>
                <Button size="sm" variant="ghost" onClick={onEdit} className="text-white hover:bg-white/20">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="text-lg font-semibold text-white mb-2 truncate">{item.title}</h4>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-3">
            <span>{item.views} views</span>
            <span>{item.likes} likes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PortfolioItemForm({
  item,
  selectedImage,
  onImageUpload,
  onSave,
  onCancel,
}: {
  item: PortfolioItem | null
  selectedImage: string | null
  onImageUpload: (files: any[]) => void
  onSave: (data: Partial<PortfolioItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    tags: item?.tags || [],
  })
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      })
      return
    }

    onSave({
      ...formData,
      image_url: selectedImage,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-white">Image</Label>
        {selectedImage ? (
          <div className="relative">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onImageUpload([])}
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
            >
              Change Image
            </Button>
          </div>
        ) : (
          <FileUploadZone
            uploadType="portfolio"
            onUploadComplete={onImageUpload}
            acceptedFileTypes={["image/*"]}
            maxFiles={1}
            className="h-32"
          />
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter portfolio item title"
          className="bg-white/5 border-white/20 text-white"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your work..."
          className="bg-white/5 border-white/20 text-white min-h-[100px]"
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-white">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-400">
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            className="bg-white/5 border-white/20 text-white"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Tag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="border-white/20 hover:bg-white/5">
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          {item ? "Update" : "Create"} Portfolio Item
        </Button>
      </div>
    </form>
  )
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card border-white/10 rounded-lg overflow-hidden">
            <div className="h-48 bg-white/10 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}