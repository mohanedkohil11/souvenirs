import ProductForm from "@/components/dashboard/product-form"

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product</p>
      </div>
      <ProductForm />
    </div>
  )
}
