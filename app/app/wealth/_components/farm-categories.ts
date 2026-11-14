import {
  AlertTriangle,
  Beef,
  Droplets,
  Egg,
  Fuel,
  HeartPulse,
  Package,
  Pill,
  Tags,
  Tractor,
  Users,
  Wrench,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const WEALTH_FARM_EXPENSE_CATEGORIES = [
  { value: "feed", label: "Feed" },
  { value: "vet", label: "Veterinary / Health" },
  { value: "labor", label: "Labor / Salaries" },
  { value: "fuel", label: "Fuel" },
  { value: "medicine", label: "Medicine" },
  { value: "equipment", label: "Equipment" },
  { value: "maintenance", label: "Maintenance" },
  { value: "utilities", label: "Utilities" },
  { value: "transport", label: "Transportation" },
  { value: "marketing", label: "Marketing" },
  { value: "livestock", label: "Livestock Purchase" },
  { value: "livestock_loss", label: "Livestock Loss" },
  { value: "other", label: "Miscellaneous" },
] as const

export const WEALTH_FARM_INCOME_CATEGORIES = [
  { value: "milk_sales", label: "Milk Sales" },
  { value: "egg_sales", label: "Egg Sales" },
  { value: "livestock_sales", label: "Livestock Sales" },
  { value: "crop_sales", label: "Crop Sales" },
] as const

export const FARM_BUDGET_CATEGORY_STYLES: Record<string, { icon: LucideIcon; color: string }> = {
  feed: { icon: Package, color: "from-green-500 to-emerald-500" },
  vet: { icon: HeartPulse, color: "from-rose-500 to-red-500" },
  labor: { icon: Users, color: "from-blue-500 to-cyan-500" },
  fuel: { icon: Fuel, color: "from-amber-500 to-orange-500" },
  medicine: { icon: Pill, color: "from-pink-500 to-rose-500" },
  equipment: { icon: Tractor, color: "from-slate-500 to-zinc-600" },
  maintenance: { icon: Wrench, color: "from-yellow-500 to-amber-500" },
  utilities: { icon: Zap, color: "from-indigo-500 to-violet-500" },
  transport: { icon: Tractor, color: "from-sky-500 to-blue-500" },
  marketing: { icon: AlertTriangle, color: "from-purple-500 to-fuchsia-500" },
  livestock: { icon: Beef, color: "from-orange-500 to-amber-600" },
  livestock_loss: { icon: AlertTriangle, color: "from-red-500 to-rose-600" },
  other: { icon: Tags, color: "from-slate-500 to-slate-600" },
  milk_sales: { icon: Droplets, color: "from-cyan-500 to-blue-500" },
  egg_sales: { icon: Egg, color: "from-amber-400 to-yellow-500" },
  livestock_sales: { icon: Beef, color: "from-orange-500 to-red-500" },
  crop_sales: { icon: Package, color: "from-lime-500 to-green-500" },
}
