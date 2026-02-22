"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type CategoryFormData = {
  id?: string
  name: string
  description: string
  image: string
  productCount: number
  featured: string[]
}

export default function CategoryForm({ initialData }: { initialData?: CategoryFormData }) {
  const router = useRouter()
  const isEditing = !!initialData?.id
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(initialData?.name ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [image, setImage] = useState(initialData?.image ?? "")
  const [productCount, setProductCount] = useState(initialData?.productCount ?? 0)
  const [featured, setFeatured] = useState(initialData?.featured?.join(", ") ?? "")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (res.ok) {
      const data = await res.json()
      setImage(data.path)
      toast.success("Image uploaded")
    } else {
      toast.error("Failed to upload image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      name,
      description,
      image,
      productCount,
      featured: featured.split(",").map((f) => f.trim()).filter(Boolean),
    }

    try {
      const url = isEditing ? `/api/categories/${initialData.id}` : "/api/categories"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(isEditing ? "Category updated" : "Category created")
        router.push("/dashboard/categories")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save category")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Category" : "New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-4">
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/image-path.jpg" />
              <div>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="w-auto" />
              </div>
            </div>
            {image && (
              <img src={image} alt="Preview" className="w-24 h-24 rounded-lg object-cover mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productCount">Display Product Count</Label>
            <Input
              id="productCount"
              type="number"
              value={productCount}
              onChange={(e) => setProductCount(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured">Featured Items (comma-separated)</Label>
            <Input
              id="featured"
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              placeholder="Pharaoh Mug, Papyrus Art, Scarab Amulet"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
