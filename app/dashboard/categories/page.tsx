"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Category = {
  id: string
  name: string
  description: string | null
  image: string | null
  productCount: number
  _count: { products: number }
}

export default function CategoriesListPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Category deleted")
      fetchCategories()
    } else {
      const data = await res.json()
      toast.error(data.error || "Failed to delete category")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">{categories.length} categories total</p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Image</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Products</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                    {category.description}
                  </td>
                  <td className="p-4">{category._count.products}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
