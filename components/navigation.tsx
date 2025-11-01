"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FlaskConical, LayoutDashboard, LineChart, Settings } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Experiments",
    href: "/experiments",
    icon: FlaskConical,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: LineChart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FlaskConical className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">ExperimentLab</span>
            </Link>
            <div className="hidden md:flex md:gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              New Experiment
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
