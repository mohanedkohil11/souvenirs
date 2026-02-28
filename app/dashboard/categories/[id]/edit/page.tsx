import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryForm from "@/components/dashboard/category-form"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground mt-1">Update &ldquo;{category.name}&rdquo;</p>
      </div>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          description: category.description ?? "",
          image: category.image ?? "",
          featured: category.featured,
        }}
      />
    </div>
  )
}
