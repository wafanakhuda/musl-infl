"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { apiClient } from "../../lib/api-client"
import { PortfolioItem } from "./portfolio-manager"
import { uploadFile } from "../../lib/upload"

interface PortfolioItemFormProps {
  item: PortfolioItem | null
  onClose: () => void
}

export default function PortfolioItemForm({ item, onClose }: PortfolioItemFormProps) {
  const [title, setTitle] = useState(item?.title || "")
  const [description, setDescription] = useState(item?.description || "")
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (item?.id) {
        await apiClient.updatePortfolioItem(item.id, {
          title,
          description,
          mediaUrl,
        })
      } else {
        await apiClient.createPortfolioItem({
          title,
          description,
          mediaUrl,
        })
      }
      onClose()
    } catch (err) {
      console.error("Error saving portfolio item:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          {item ? "Edit Portfolio Item" : "Add Portfolio Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
<Input
  type="file"
  accept="image/*,video/*"
  onChange={async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setLoading(true)
        const uploadedUrl = await uploadFile(file)
        setMediaUrl(uploadedUrl)
      } catch (err) {
        console.error("Upload failed:", err)
      } finally {
        setLoading(false)
      }
    }
  }}
/>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
