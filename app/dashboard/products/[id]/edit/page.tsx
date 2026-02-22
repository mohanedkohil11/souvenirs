import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "@/components/dashboard/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { specifications: true },
  })

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">Update &ldquo;{product.name}&rdquo;</p>
      </div>
      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          description: product.description ?? "",
          fullDescription: product.fullDescription ?? "",
          image: product.image ?? "",
          rating: product.rating,
          reviews: product.reviews,
          inStock: product.inStock,
          quantity: product.quantity,
          sales: product.sales,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          isFlashSale: product.isFlashSale,
          categoryId: product.categoryId,
          specifications: product.specifications.map((s) => ({
            label: s.label,
            value: s.value,
          })),
        }}
      />
    </div>
  )
}
