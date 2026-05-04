import { Badge } from "@/components/ui/badge"
import type {
  PedidoEstado,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"
import {
  estadoPedidoConfig,
  prioridadConfig,
  severidadConfig,
} from "@/domain/ui-config"
import { cn } from "@/lib/utils"

export function StateBadge({ state }: { state: PedidoEstado }) {
  const config = estadoPedidoConfig[state]

  return (
    <Badge className={cn("w-fit rounded-md border", config.className)}>
      {config.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: PrioridadOperativa }) {
  const config = prioridadConfig[priority]

  return (
    <Badge className={cn("w-fit rounded-md border", config.className)}>
      {config.label}
    </Badge>
  )
}

export function SeverityBadge({ severity }: { severity: SeveridadAlerta }) {
  const config = severidadConfig[severity]

  return (
    <Badge className={cn("w-fit rounded-md border", config.className)}>
      {config.label}
    </Badge>
  )
}

export function KeyValueRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-200">{value}</span>
    </div>
  )
}
