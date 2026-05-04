import type { LucideIcon } from "lucide-react"
import { ChevronRight, ShieldAlert } from "lucide-react"

import { iconMap } from "@/components/ayro/icon-map"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ayroSettings, type MetricAccent } from "@/domain/settings"
import { getClienteNombre, getDashboardData } from "@/domain/selectors"
import type {
  AccionOperativa,
  AlertaOperativa,
  AyroDataset,
  ConfiguracionLocal,
  Pedido,
  PedidoEstado,
  PrioridadOperativa,
} from "@/domain/types"
import {
  estadoPedidoConfig,
  metricAccentConfig,
  prioridadConfig,
  severidadConfig,
} from "@/domain/ui-config"
import { cn } from "@/lib/utils"

const dashboardLabels = ayroSettings.dashboard.labels

export function DashboardView({
  dataset,
  config,
}: {
  dataset: AyroDataset
  config: ConfiguracionLocal
}) {
  const dashboardData = getDashboardData(dataset, config)
  const pedidoEstados = Object.keys(
    dashboardData.pedidosPorEstado
  ) as PedidoEstado[]

  return (
    <>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {ayroSettings.metrics.map((metric) => {
          const Icon = iconMap[metric.icon]

          return (
            <Metric
              key={metric.key}
              title={metric.title}
              value={String(dashboardData.metricas[metric.key])}
              helper={metric.helper}
              icon={Icon}
              accent={metric.accent}
            />
          )
        })}
      </section>

      <section className="mt-6 grid gap-5 2xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0 shadow-2xl shadow-black/25">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    {ayroSettings.dashboard.actionQueueTitle}
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-400">
                    {ayroSettings.dashboard.actionQueueDescription}
                  </p>
                </div>
                <Badge className="w-fit border-rose-400/30 bg-rose-400/10 text-rose-100">
                  {dashboardData.colaAccion.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 lg:grid-cols-2">
              {dashboardData.colaAccion.map((action) => (
                <ActionQueueItem key={action.id} action={action} />
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0 shadow-2xl shadow-black/25">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    {ayroSettings.dashboard.kanbanTitle}
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-400">
                    {ayroSettings.dashboard.kanbanDescription}
                  </p>
                </div>
                <Badge className="w-fit border-white/10 bg-white/[0.06] text-slate-300">
                  {dataset.pedidos.length} {ayroSettings.dashboard.mockOrdersLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-4">
              {pedidoEstados.map((state) => (
                <OrderColumn
                  key={state}
                  dataset={dataset}
                  state={state}
                  orders={dashboardData.pedidosPorEstado[state]}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-1">
          <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <CardTitle className="text-base font-semibold text-white">
                {ayroSettings.dashboard.alertsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {dashboardData.alertas.map((alert) => (
                <OperationalAlert key={alert.id} alert={alert} />
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <CardTitle className="text-base font-semibold text-white">
                {ayroSettings.dashboard.historyTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {dashboardData.historialReciente.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                  <div>
                    <p className="text-sm font-medium leading-5 text-slate-200">
                      {event.accion}
                    </p>
                    <p className="text-sm leading-5 text-slate-400">
                      {event.detalle}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {dashboardLabels.responsible}: {event.responsable} ·{" "}
                      {dashboardLabels.date}: {event.fecha}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {ayroSettings.dashboard.moduleSectionTitle}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {ayroSettings.modules.map((module) => {
            const Icon = iconMap[module.icon]

            return (
              <article
                key={module.title}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:text-cyan-200" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-5 text-slate-400">
                  {module.detail}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}

function Metric({
  title,
  value,
  helper,
  icon: Icon,
  accent,
}: {
  title: string
  value: string
  helper: string
  icon: LucideIcon
  accent: MetricAccent
}) {
  return (
    <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg border",
            metricAccentConfig[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function ActionQueueItem({ action }: { action: AccionOperativa }) {
  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{action.titulo}</p>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            {action.detalle}
          </p>
        </div>
        <PriorityBadge priority={action.prioridad} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>
          {dashboardLabels.responsible}: {action.responsable}
        </span>
        <span>
          {dashboardLabels.action}: {action.accionSugerida}
        </span>
      </div>
    </article>
  )
}

function OrderColumn({
  dataset,
  state,
  orders,
}: {
  dataset: AyroDataset
  state: PedidoEstado
  orders: Pedido[]
}) {
  const config = estadoPedidoConfig[state]
  const Icon = iconMap[config.icon]

  return (
    <section className="min-h-[360px] rounded-lg border border-white/10 bg-[#080c14] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", config.dotClassName)} />
          <h3 className="truncate text-sm font-semibold text-white">
            {config.label}
          </h3>
        </div>
        <Badge className={cn("border", config.className)}>
          <Icon className="h-3 w-3" />
          {orders.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {orders.map((pedido) => (
          <article
            key={pedido.id}
            className="rounded-lg border border-white/10 bg-white/[0.035] p-3 shadow-lg shadow-black/15"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {getClienteNombre(dataset, pedido.clienteId)}
                </p>
                <p className="mt-1 text-xs text-slate-500">{pedido.id}</p>
              </div>
              <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-slate-300">
                {pedido.fecha}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-400">
              <span>
                {pedido.bultos} {dashboardLabels.bultos}
              </span>
              <span>
                {dashboardLabels.responsible}: {pedido.responsable}
              </span>
              <PriorityBadge priority={pedido.prioridad} />
            </div>

            <div className="mt-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-2 text-xs leading-4 text-amber-100">
              {pedido.observaciones}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PriorityBadge({ priority }: { priority: PrioridadOperativa }) {
  const config = prioridadConfig[priority]

  return (
    <Badge className={cn("border", config.className)}>
      {dashboardLabels.priority}: {config.label}
    </Badge>
  )
}

function OperationalAlert({ alert }: { alert: AlertaOperativa }) {
  const severity = severidadConfig[alert.severidad]

  return (
    <article className={cn("rounded-lg border p-3", severity.className)}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{alert.titulo}</h3>
            <span className="rounded-md bg-black/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">
              {severity.label}
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-300">{alert.detalle}</p>
          <p className="mt-2 text-xs text-slate-400">
            {dashboardLabels.responsible}: {alert.responsable} ·{" "}
            {dashboardLabels.action}: {alert.accionSugerida}
          </p>
        </div>
      </div>
    </article>
  )
}
