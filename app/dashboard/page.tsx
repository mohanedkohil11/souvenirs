export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderOpen, ShoppingCart, DollarSign, Star, TrendingUp } from "lucide-react"
import { getProductCount, getCategoryCount } from "@/lib/data"
import { prisma } from "@/lib/prisma"

export default async function DashboardOverview() {
  const [productCount, categoryCount, orderCount, pendingOrders, revenue] = await Promise.all([
    getProductCount(),
    getCategoryCount(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ])

  const stats = [
    { label: "Total Products", value: productCount, icon: Package, color: "text-blue-600" },
    { label: "Categories", value: categoryCount, icon: FolderOpen, color: "text-green-600" },
    { label: "Total Orders", value: orderCount, icon: ShoppingCart, color: "text-purple-600" },
    { label: "Pending Orders", value: pendingOrders, icon: Star, color: "text-yellow-600" },
    { label: "Total Revenue", value: `$${(revenue._sum.total ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-emerald-600" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Sedra admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
