import type {
  PedidoEstado,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"
import {
  ayroSettings,
  type AyroIconKey,
  type MetricAccent,
} from "@/domain/settings"

export const estadoPedidoConfig: Record<
  PedidoEstado,
  {
    label: string
    icon: AyroIconKey
    className: string
    dotClassName: string
  }
> = {
  Armado: {
    ...ayroSettings.pedidoEstados.Armado,
    className: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    dotClassName: "bg-cyan-300",
  },
  Negociacion: {
    ...ayroSettings.pedidoEstados.Negociacion,
    className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    dotClassName: "bg-amber-300",
  },
  Confirmado: {
    ...ayroSettings.pedidoEstados.Confirmado,
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    dotClassName: "bg-emerald-300",
  },
  Entregado: {
    ...ayroSettings.pedidoEstados.Entregado,
    className: "border-slate-500/30 bg-slate-500/10 text-slate-200",
    dotClassName: "bg-slate-300",
  },
}

export const prioridadConfig: Record<
  PrioridadOperativa,
  {
    label: string
    className: string
  }
> = {
  alta: {
    ...ayroSettings.prioridades.alta,
    className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  },
  media: {
    ...ayroSettings.prioridades.media,
    className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  },
  baja: {
    ...ayroSettings.prioridades.baja,
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  },
}

export const severidadConfig: Record<
  SeveridadAlerta,
  {
    label: string
    className: string
  }
> = {
  critica: {
    ...ayroSettings.severidades.critica,
    className: "border-rose-400/35 bg-rose-400/10 text-rose-100",
  },
  alta: {
    ...ayroSettings.severidades.alta,
    className: "border-orange-400/35 bg-orange-400/10 text-orange-100",
  },
  media: {
    ...ayroSettings.severidades.media,
    className: "border-amber-400/35 bg-amber-400/10 text-amber-100",
  },
  baja: {
    ...ayroSettings.severidades.baja,
    className: "border-cyan-400/35 bg-cyan-400/10 text-cyan-100",
  },
}

export const metricAccentConfig: Record<MetricAccent, string> = {
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  slate: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-200",
}
