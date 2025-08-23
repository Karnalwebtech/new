"use client"
import React, { memo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NavigateBtn from '@/components/buttons/navigate-btn'

const categories = [
  {
    name: "Laptops",
    handle: "/laptops",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Accessories",
    handle: "/accessories",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Phones",
    handle: "/phones",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Monitors",
    handle: "/monitors",
    status: "Active",
    visibility: "Public",
  },
]


const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Categories</h1>
            <p className="text-muted-foreground">
              Organize products into categories, and manage those categories&apos; ranking and hierarchy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-sm bg-transparent">
              Edit ranking
            </Button>
            <NavigateBtn 
              path="/dashboard/products/categories/create"
              title="Create"
              style="text-sm bg-black text-white"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search" className="pl-10 bg-background border-border" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Handle</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Visibility</th>
                  <th className="w-12 py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {category.handle}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">{category.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">{category.visibility}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">1 — 4 of 4 results</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>1 of 1 pages</span>
            <Button variant="outline" size="sm" disabled className="text-muted-foreground bg-transparent">
              Prev
            </Button>
            <Button variant="outline" size="sm" disabled className="text-muted-foreground bg-transparent">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default memo(Categories)