// File: components/portfolio/portfolio-manager.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { apiClient } from "../../lib/api-client"
import { Plus, Trash, Pencil } from "lucide-react"
import PortfolioItemForm from "./portfolio-item-form"

export interface PortfolioItem {
  id: string
  title: string
  description?: string
  mediaUrl: string
}

interface PortfolioManagerProps {
  onClose?: () => void
}

export default function PortfolioManager({ onClose }: PortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchItems = async () => {
    try {
      const data = await apiClient.get("/portfolio")
      setItems(data)
    } catch (err) {
      console.error("Failed to load portfolio:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deletePortfolioItem(id)
      fetchItems()
    } catch (err) {
      console.error("Failed to delete item:", err)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">My Portfolio</h3>
        <Button onClick={() => { setEditingItem(null); setIsFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="relative overflow-hidden group border">
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="font-medium">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <Button
                size="icon"
                variant="outline"
                onClick={() => { setEditingItem(item); setIsFormOpen(true) }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <PortfolioItemForm
          item={editingItem}
          onClose={() => {
            setIsFormOpen(false)
            setEditingItem(null)
            fetchItems()
            onClose?.()
          }}
        />
      )}
    </div>
  )
}
