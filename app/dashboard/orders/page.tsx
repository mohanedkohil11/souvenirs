"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string | null
}

type Order = {
  id: string
  orderNumber: string
  status: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  address: string
  deliveryPeriod: string
  total: number
  createdAt: string
  items: OrderItem[]
}

const DELIVERY_PERIOD_LABELS: Record<string, string> = {
  morning: "Morning (9 AM - 12 PM)",
  afternoon: "Afternoon (12 PM - 4 PM)",
  evening: "Evening (4 PM - 8 PM)",
  night: "Night (8 PM - 11 PM)",
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = async () => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } else {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return

    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Order deleted")
      fetchOrders()
    } else {
      toast.error("Failed to delete order")
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.firstName.toLowerCase().includes(search.toLowerCase()) ||
      o.lastName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">{orders.length} orders total</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.firstName} {order.lastName} &middot; {order.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-lg">${order.total.toFixed(2)}</span>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      className="gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {expandedId === order.id ? "Hide" : "Details"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(order.id, order.orderNumber)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-border p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Customer & Delivery</h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">{order.firstName} {order.lastName}</p>
                        <p>{order.email}</p>
                        <p>{order.phone}</p>
                        <p className="mt-2 font-medium text-foreground">Delivery Address</p>
                        <p>{order.address}</p>
                        <p>{order.city}, Egypt</p>
                        <p className="mt-2 font-medium text-foreground">Preferred Time</p>
                        <p>{DELIVERY_PERIOD_LABELS[order.deliveryPeriod] || order.deliveryPeriod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
