"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, ChevronDown, ChevronRight, Tag } from "lucide-react"

interface ChildItem {
  id: string
  name: string
  order: number
  isNew?: boolean
}

interface Category {
  id: string
  name: string
  order: number
  children: ChildItem[]
  isExpanded: boolean
  icon: string
}

export default function CategoryDragSystem() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Monitors",
      order: 0,
      children: [],
      isExpanded: false,
      icon: "monitor",
    },
    {
      id: "2",
      name: "Accessories",
      order: 1,
      children: [{ id: "2-1", name: "Wireless Mouse", order: 0, isNew: true }],
      isExpanded: true,
      icon: "accessories",
    },
    {
      id: "3",
      name: "Phones",
      order: 2,
      children: [],
      isExpanded: false,
      icon: "phone",
    },
    {
      id: "4",
      name: "Laptops",
      order: 3,
      children: [],
      isExpanded: false,
      icon: "laptop",
    },
  ])
  const [dragState, setDragState] = useState<{
    type: "category" | "child" | null
    draggedId: string | null
    draggedCategoryId?: string
    startY?: number
    startX?: number
  }>({
    type: null,
    draggedId: null,
  })

  const handleCategoryMouseDown = useCallback((e: React.MouseEvent, categoryId: string) => {
    e.preventDefault()
    setDragState({
      type: "category",
      draggedId: categoryId,
      startY: e.clientY,
      startX: e.clientX, // Track X position for horizontal drag
    })
  }, [])

  const handleChildMouseDown = useCallback((e: React.MouseEvent, childId: string, categoryId: string) => {
    e.preventDefault()
    setDragState({
      type: "child",
      draggedId: childId,
      draggedCategoryId: categoryId,
      startX: e.clientX,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.draggedId) return

      if (dragState.type === "category" && dragState.startY && dragState.startX) {
        const deltaY = e.clientY - dragState.startY
        const deltaX = e.clientX - dragState.startX
        const threshold = 50

        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal drag - convert category to child or vice versa
          if (deltaX > 0) {
            // Drag right - make this category a child of the previous category
            setCategories((prev) => {
              const sortedCategories = [...prev].sort((a, b) => a.order - b.order)
              const draggedCategory = sortedCategories.find((cat) => cat.id === dragState.draggedId)
              const currentIndex = sortedCategories.findIndex((cat) => cat.id === dragState.draggedId)

              if (!draggedCategory || currentIndex === 0) return prev // Can't make first category a child

              const targetCategory = sortedCategories[currentIndex - 1]

              // Convert category to child item
              const newChild: ChildItem = {
                id: draggedCategory.id,
                name: draggedCategory.name,
                order: targetCategory.children.length,
              }

              return prev
                .filter((cat) => cat.id !== dragState.draggedId) // Remove original category
                .map((category) => {
                  if (category.id === targetCategory.id) {
                    return {
                      ...category,
                      children: [...category.children, newChild],
                      isExpanded: true, // Auto-expand to show new child
                    }
                  }
                  return category
                })
                .map((cat, index) => ({ ...cat, order: index })) // Reorder remaining categories
            })
          }

          setDragState((prev) => ({ ...prev, startX: e.clientX }))
        } else if (Math.abs(deltaY) > threshold) {
          // Vertical drag - reorder categories
          const direction = deltaY > 0 ? 1 : -1

          setCategories((prev) => {
            const draggedCategory = prev.find((cat) => cat.id === dragState.draggedId)
            if (!draggedCategory) return prev

            const sortedCategories = [...prev].sort((a, b) => a.order - b.order)
            const currentIndex = sortedCategories.findIndex((cat) => cat.id === dragState.draggedId)
            const newIndex = Math.max(0, Math.min(sortedCategories.length - 1, currentIndex + direction))

            if (currentIndex === newIndex) return prev

            const newCategories = [...sortedCategories]
            const [removed] = newCategories.splice(currentIndex, 1)
            newCategories.splice(newIndex, 0, removed)

            return newCategories.map((cat, index) => ({ ...cat, order: index }))
          })

          setDragState((prev) => ({ ...prev, startY: e.clientY }))
        }
      } else if (dragState.type === "child" && dragState.startX && dragState.draggedCategoryId) {
        const deltaX = e.clientX - dragState.startX
        const threshold = 80

        if (Math.abs(deltaX) > threshold) {
          setCategories((prev) => {
            const draggedChild = prev
              .find((cat) => cat.id === dragState.draggedCategoryId)
              ?.children.find((child) => child.id === dragState.draggedId)

            if (!draggedChild) return prev

            if (deltaX < 0) {
              const newCategory: Category = {
                id: draggedChild.id,
                name: draggedChild.name,
                order: prev.length,
                children: [],
                isExpanded: false,
                icon: "folder",
              }

              return prev
                .map((category) => {
                  if (category.id === dragState.draggedCategoryId) {
                    return {
                      ...category,
                      children: category.children
                        .filter((child) => child.id !== dragState.draggedId)
                        .map((child, index) => ({ ...child, order: index })),
                    }
                  }
                  return category
                })
                .concat(newCategory)
                .map((cat, index) => ({ ...cat, order: index }))
            } else {
              const sortedCategories = [...prev].sort((a, b) => a.order - b.order)
              const currentCategoryIndex = sortedCategories.findIndex((cat) => cat.id === dragState.draggedCategoryId)
              const nextCategoryIndex = currentCategoryIndex + 1

              if (nextCategoryIndex < sortedCategories.length) {
                const targetCategory = sortedCategories[nextCategoryIndex]

                return prev.map((category) => {
                  if (category.id === dragState.draggedCategoryId) {
                    // Remove from current category
                    return {
                      ...category,
                      children: category.children
                        .filter((child) => child.id !== dragState.draggedId)
                        .map((child, index) => ({ ...child, order: index })),
                    }
                  } else if (category.id === targetCategory.id) {
                    // Add to target category
                    const newChild: ChildItem = {
                      id: draggedChild.id,
                      name: draggedChild.name,
                      order: category.children.length,
                      isNew: draggedChild.isNew,
                    }
                    return {
                      ...category,
                      children: [...category.children, newChild],
                      isExpanded: true, // Auto-expand to show the moved item
                    }
                  }
                  return category
                })
              }
            }

            return prev
          })

          setDragState((prev) => ({ ...prev, startX: e.clientX }))
        }
      }
    },
    [dragState],
  )

  const handleMouseUp = useCallback(() => {
    setDragState({ type: null, draggedId: null })
  }, [])

  React.useEffect(() => {
    if (dragState.draggedId) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [dragState.draggedId, handleMouseMove, handleMouseUp])

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: `New Category ${categories.length + 1}`,
      order: categories.length,
      children: [],
      isExpanded: false,
      icon: "folder",
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const addChild = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId) return category

        const newChild: ChildItem = {
          id: `${categoryId}-${Date.now()}`,
          name: `New Item ${category.children.length + 1}`,
          order: category.children.length,
        }

        return {
          ...category,
          children: [...category.children, newChild],
        }
      }),
    )
  }

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category,
      ),
    )
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="space-y-1">
            {sortedCategories.map((category) => (
              <div key={category.id}>
                {/* Category Row */}
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                    dragState.draggedId === category.id && dragState.type === "category" ? "bg-blue-50 shadow-sm" : ""
                  }`}
                >
                  {/* Drag Handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                    onMouseDown={(e) => handleCategoryMouseDown(e, category.id)}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Expand/Collapse */}
                  <button onClick={() => toggleCategory(category.id)} className="p-1 hover:bg-gray-200 rounded">
                    {category.isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Category Icon */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* Category Name */}
                  <span className="text-sm text-gray-700 font-medium">{category.name}</span>

                  {/* Add Item Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addChild(category.id)}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Children (when expanded) */}
                {category.isExpanded && (
                  <div className="ml-12 space-y-1">
                    {[...category.children]
                      .sort((a, b) => a.order - b.order)
                      .map((child) => (
                        <div
                          key={child.id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                            dragState.draggedId === child.id && dragState.type === "child" ? "bg-blue-50 shadow-sm" : ""
                          }`}
                        >
                          {/* Child Drag Handle */}
                          <div
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                            onMouseDown={(e) => handleChildMouseDown(e, child.id, category.id)}
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Child Icon */}
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-blue-400" />
                          </div>

                          {/* Child Name */}
                          <span className="text-sm text-gray-600">{child.name}</span>

                          {/* New Badge */}
                          {child.isNew && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                              New
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Category Button */}
          <div className="mt-6">
            <Button variant="ghost" onClick={addCategory} className="text-gray-500 hover:text-gray-700 text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
