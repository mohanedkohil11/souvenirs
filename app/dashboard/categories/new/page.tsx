import CategoryForm from "@/components/dashboard/category-form"

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Category</h1>
        <p className="text-muted-foreground mt-1">Create a new product category</p>
      </div>
      <CategoryForm />
    </div>
  )
}
