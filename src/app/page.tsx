import type { LucideIcon } from "lucide-react"
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileSliders,
  Handshake,
  History,
  LayoutDashboard,
  Package,
  Plus,
  RadioTower,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ayroDataset } from "@/data/mock-index"
import { ayroSettings, type AyroIconKey, type MetricAccent } from "@/domain/settings"
import {
  getClienteNombre,
  getDashboardData,
} from "@/domain/selectors"
import type {
  AccionOperativa,
  AlertaOperativa,
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

const iconMap: Record<AyroIconKey, LucideIcon> = {
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

const dashboardData = getDashboardData(ayroDataset)
const dashboardLabels = ayroSettings.dashboard.labels
const pedidoEstados = Object.keys(
  dashboardData.pedidosPorEstado
) as PedidoEstado[]
const activeOrders = ayroDataset.pedidos.filter(
  (pedido) => pedido.estado !== "Entregado"
)
const activePackages = activeOrders.reduce(
  (acc, pedido) => acc + pedido.bultos,
  0
)

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[272px_1fr]">
        <aside className="border-b border-white/10 bg-[#090d16]/95 px-5 py-5 xl:border-b-0 xl:border-r xl:px-6">
          <div className="flex items-center justify-between xl:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <RadioTower className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-[0.16em] text-white">
                  {ayroSettings.app.name}
                </h1>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/70">
                  {ayroSettings.app.subtitle}
                </p>
              </div>
            </div>

            <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200 xl:mt-7">
              {ayroSettings.dashboard.onlineLabel}
            </Badge>
          </div>

          <nav className="mt-6 grid gap-2 sm:grid-cols-3 xl:mt-10 xl:block xl:space-y-2">
            {ayroSettings.navigation.map((item) => {
              const Icon = iconMap[item.icon]

              return (
                <a
                  key={item.label}
                  href="#"
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                    item.active
                      ? "border-cyan-300/35 bg-cyan-300/12 text-white shadow-[0_0_24px_rgba(34,211,238,0.10)]"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="mt-8 hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 xl:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {ayroSettings.dashboard.pulseTitle}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {ayroSettings.dashboard.activePackagesLabel}
                </span>
                <span className="font-semibold text-white">{activePackages}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-900">
                <div className="h-2 w-3/4 rounded-full bg-cyan-300" />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {ayroSettings.dashboard.localDataNote}
              </p>
            </div>
          </div>
        </aside>

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/75">
                {ayroSettings.app.description}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {ayroSettings.dashboard.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {ayroSettings.dashboard.description}
              </p>
            </div>

            <Button className="h-10 w-fit rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              <Plus className="mr-2 h-4 w-4" />
              {ayroSettings.dashboard.primaryAction}
            </Button>
          </header>

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
                      {ayroDataset.pedidos.length}{" "}
                      {ayroSettings.dashboard.mockOrdersLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-4">
                  {pedidoEstados.map((state) => (
                    <OrderColumn
                      key={state}
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
        </section>
      </div>
    </main>
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
  state,
  orders,
}: {
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
                  {getClienteNombre(ayroDataset, pedido.clienteId)}
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
