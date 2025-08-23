"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  X,
  Info,
} from "lucide-react"

interface SubCategory {
  id: string
  name: string
  isNew?: boolean
}

interface Category {
  id: string
  name: string
  icon: string
  isExpanded?: boolean
  subcategories?: SubCategory[]
}

const initialCategories: Category[] = [
  { id: "1", name: "Monitors", icon: "🖥️", subcategories: [] },
  {
    id: "2",
    name: "Accessories",
    icon: "🔌",
    isExpanded: true,
    subcategories: [{ id: "2-1", name: "asasas", isNew: true }],
  },
  { id: "3", name: "Phones", icon: "📱", subcategories: [] },
  { id: "4", name: "Laptops", icon: "💻", subcategories: [] },
]

type DragItem =
  | { type: "category"; id: string }
  | { type: "subcategory"; id: string; parentId: string }

export default function CategoryOrganizer() {
  const [categories, setCategories] = useState(initialCategories)
  const [activeTab, setActiveTab] = useState("organize")
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)

  /** ---------- DRAG + DROP ---------- */
  const handleDragStart = (
    e: React.DragEvent,
    type: DragItem["type"],
    id: string,
    parentId?: string
  ) => {
    setDraggedItem({ type, id, parentId } as DragItem)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (
    e: React.DragEvent,
    targetType: "category" | "subcategory",
    targetId: string,
    targetParentId?: string
  ) => {
    e.preventDefault()
    if (!draggedItem) return

    const newCategories = [...categories]

    // Reorder categories
    if (
      draggedItem.type === "category" &&
      targetType === "category"
    ) {
      const draggedIndex = newCategories.findIndex(
        (c) => c.id === draggedItem.id
      )
      const targetIndex = newCategories.findIndex(
        (c) => c.id === targetId
      )
      if (draggedIndex > -1 && targetIndex > -1) {
        const [moved] = newCategories.splice(draggedIndex, 1)
        newCategories.splice(targetIndex, 0, moved)
        setCategories(newCategories)
      }
    }

    // Reorder subcategories
    if (
      draggedItem.type === "subcategory" &&
      targetType === "subcategory" &&
      draggedItem.parentId === targetParentId
    ) {
      const parent = newCategories.find(
        (c) => c.id === targetParentId
      )
      if (parent?.subcategories) {
        const draggedIndex = parent.subcategories.findIndex(
          (s) => s.id === draggedItem.id
        )
        const targetIndex = parent.subcategories.findIndex(
          (s) => s.id === targetId
        )
        if (draggedIndex > -1 && targetIndex > -1) {
          const [moved] = parent.subcategories.splice(draggedIndex, 1)
          parent.subcategories.splice(targetIndex, 0, moved)
          setCategories(newCategories)
        }
      }
    }

    setDraggedItem(null)
  }

  /** ---------- SWIPE HELPERS ---------- */
  const moveAsChildOfPrevious = (id: string, parentId?: string) => {
    const newCategories = [...categories]

    if (parentId) {
      const parent = newCategories.find((c) => c.id === parentId)
      const parentIndex = newCategories.findIndex(
        (c) => c.id === parentId
      )
      if (parent && parent.subcategories && parentIndex > 0) {
        const idx = parent.subcategories.findIndex((s) => s.id === id)
        if (idx > -1) {
          const [sub] = parent.subcategories.splice(idx, 1)
          const prev = newCategories[parentIndex - 1]
          prev.subcategories = prev.subcategories || []
          prev.subcategories.push(sub)
          prev.isExpanded = true
          setCategories(newCategories)
        }
      }
    } else {
      const idx = newCategories.findIndex((c) => c.id === id)
      if (idx > 0) {
        const [cat] = newCategories.splice(idx, 1)
        const prev = newCategories[idx - 1]
        prev.subcategories = prev.subcategories || []
        prev.subcategories.push({ id: cat.id, name: cat.name })
        prev.isExpanded = true
        setCategories(newCategories)
      }
    }
  }

  const moveAsTopLevelParent = (id: string, parentId: string) => {
    const newCategories = [...categories]
    const parent = newCategories.find((c) => c.id === parentId)
    if (parent?.subcategories) {
      const idx = parent.subcategories.findIndex((s) => s.id === id)
      if (idx > -1) {
        const [sub] = parent.subcategories.splice(idx, 1)
        newCategories.push({
          id: sub.id,
          name: sub.name,
          icon: "📁",
          subcategories: [],
        })
        setCategories(newCategories)
      }
    }
  }

  /** ---------- TOUCH HANDLERS (swipe) ---------- */
  const handleTouchStart = (
    e: React.TouchEvent,
    type: "category" | "subcategory",
    id: string,
    parentId?: string
  ) => {
    const touch = e.touches[0]
    const el = e.currentTarget as HTMLElement
    el.dataset.startX = String(touch.clientX)
    el.dataset.startY = String(touch.clientY)
    el.dataset.dragType = type
    el.dataset.dragId = id
    if (parentId) el.dataset.parentId = parentId
    el.style.transform = "scale(1.02)"
    el.style.zIndex = "10"
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const el = e.currentTarget as HTMLElement
    const startX = +el.dataset.startX!
    const deltaX = touch.clientX - startX

    if (Math.abs(deltaX) > 20) {
      el.style.transform = `translateX(${deltaX}px) scale(1.02)`
      el.style.backgroundColor =
        deltaX < -50 ? "#dcfce7" : deltaX > 50 ? "#fecaca" : ""
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const el = e.currentTarget as HTMLElement
    const touch = e.changedTouches[0]
    const startX = +el.dataset.startX!
    const deltaX = touch.clientX - startX
    const type = el.dataset.dragType as "category" | "subcategory"
    const id = el.dataset.dragId!
    const parentId = el.dataset.parentId

    if (deltaX < -50) {
      type === "category"
        ? moveAsChildOfPrevious(id)
        : moveAsChildOfPrevious(id, parentId)
    }
    if (deltaX > 50 && type === "subcategory" && parentId) {
      moveAsTopLevelParent(id, parentId)
    }

    // reset styles
    el.style.transform = ""
    el.style.backgroundColor = ""
    el.style.zIndex = ""
  }

  /** ---------- UI ---------- */
  const toggleCategory = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
      )
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
    

        {/* Category List */}
        <div className="p-6 space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              {/* Category row */}
              <div
                className="flex items-center gap-3 p-3 rounded-lg border bg-white cursor-move"
                draggable
                data-drop-target
                data-drop-type="category"
                data-drop-id={cat.id}
                onDragStart={(e) => handleDragStart(e, "category", cat.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "category", cat.id)}
                onTouchStart={(e) => handleTouchStart(e, "category", cat.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
                {cat.subcategories?.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {cat.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
              </div>

              {/* Subcategories */}
              {cat.isExpanded && cat.subcategories?.length > 0 && (
                <div className="ml-10 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 cursor-move"
                      draggable
                      data-drop-target
                      data-drop-type="subcategory"
                      data-drop-id={sub.id}
                      data-parent-id={cat.id}
                      onDragStart={(e) =>
                        handleDragStart(e, "subcategory", sub.id, cat.id)
                      }
                      onDragOver={handleDragOver}
                      onDrop={(e) =>
                        handleDrop(e, "subcategory", sub.id, cat.id)
                      }
                      onTouchStart={(e) =>
                        handleTouchStart(e, "subcategory", sub.id, cat.id)
                      }
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span>🏷️</span>
                      <span>{sub.name}</span>
                      {sub.isNew && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

       
    </div>
  )
}
