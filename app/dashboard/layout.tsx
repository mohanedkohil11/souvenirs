"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/categories", label: "Categories", icon: FolderOpen },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === "/dashboard/login") {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/dashboard/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-50">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">Souvenir Stories</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Store className="w-5 h-5" />
            View Store
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
