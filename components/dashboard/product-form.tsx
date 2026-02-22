"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Spec = { label: string; value: string }

type ProductFormData = {
  id?: string
  name: string
  price: number
  originalPrice: number | null
  discount: number | null
  description: string
  fullDescription: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
  quantity: number
  sales: number
  isFeatured: boolean
  isBestSeller: boolean
  isFlashSale: boolean
  categoryId: string
  specifications: Spec[]
}

type Category = { id: string; name: string }

const defaultData: ProductFormData = {
  name: "",
  price: 0,
  originalPrice: null,
  discount: null,
  description: "",
  fullDescription: "",
  image: "",
  rating: 0,
  reviews: 0,
  inStock: true,
  quantity: 0,
  sales: 0,
  isFeatured: false,
  isBestSeller: false,
  isFlashSale: false,
  categoryId: "",
  specifications: [],
}

export default function ProductForm({ initialData }: { initialData?: ProductFormData }) {
  const router = useRouter()
  const isEditing = !!initialData?.id
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormData>(initialData ?? defaultData)

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  const addSpec = () => setForm((prev) => ({ ...prev, specifications: [...prev.specifications, { label: "", value: "" }] }))

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    setForm((prev) => {
      const specs = [...prev.specifications]
      specs[index] = { ...specs[index], [field]: value }
      return { ...prev, specifications: specs }
    })
  }

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (res.ok) {
      const data = await res.json()
      update("image", data.path)
      toast.success("Image uploaded")
    } else {
      toast.error("Failed to upload image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.categoryId) {
      toast.error("Please select a category")
      setLoading(false)
      return
    }

    try {
      const url = isEditing ? `/api/products/${initialData!.id}` : "/api/products"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specifications: form.specifications.filter((s) => s.label && s.value),
        }),
      })

      if (res.ok) {
        toast.success(isEditing ? "Product updated" : "Product created")
        router.push("/dashboard/products")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save product")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input id="originalPrice" type="number" step="0.01" value={form.originalPrice ?? ""} onChange={(e) => update("originalPrice", e.target.value || null)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" value={form.discount ?? ""} onChange={(e) => update("discount", e.target.value || null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input id="description" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea id="fullDescription" value={form.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="/image-path.jpg" />
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="w-auto" />
          </div>
          {form.image && (
            <img src={form.image} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory & Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => update("rating", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviews">Reviews</Label>
              <Input id="reviews" type="number" value={form.reviews} onChange={(e) => update("reviews", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales">Sales</Label>
              <Input id="sales" type="number" value={form.sales} onChange={(e) => update("sales", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="flex items-center gap-3">
              <Switch checked={form.inStock} onCheckedChange={(v) => update("inStock", v)} />
              <Label>In Stock</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => update("isFeatured", v)} />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isBestSeller} onCheckedChange={(v) => update("isBestSeller", v)} />
              <Label>Best Seller</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isFlashSale} onCheckedChange={(v) => update("isFlashSale", v)} />
              <Label>Flash Sale</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Specifications</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSpec} className="gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.specifications.length === 0 && (
            <p className="text-sm text-muted-foreground">No specifications yet. Click &quot;Add&quot; to add one.</p>
          )}
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input placeholder="Label" value={spec.label} onChange={(e) => updateSpec(i, "label", e.target.value)} />
              <Input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeSpec(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
