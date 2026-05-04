import type { LucideIcon } from "lucide-react"
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  FileSliders,
  Handshake,
  History,
  LayoutDashboard,
  Package,
  RadioTower,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"

import type { AyroIconKey } from "@/domain/settings"

export const iconMap: Record<AyroIconKey, LucideIcon> = {
  building: Building2,
  check: CheckCircle2,
  clipboard: ClipboardList,
  handshake: Handshake,
  history: History,
  layout: LayoutDashboard,
  package: Package,
  settings: Settings,
  shield: ShieldAlert,
  shoppingCart: ShoppingCart,
  sliders: FileSliders,
  truck: Truck,
  users: Users,
}

export const BrandIcon = RadioTower
