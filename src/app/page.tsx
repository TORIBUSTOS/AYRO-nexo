import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileSliders,
  Handshake,
  History,
  LayoutDashboard,
  Package,
  Plus,
  RadioTower,
  ShieldAlert,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OrderState = "Armado" | "Negociacion" | "Confirmado" | "Entregado"
type AlertSeverity = "critica" | "media" | "info"

type Order = {
  id: string
  client: string
  state: OrderState
  packages: number
  date: string
  warning?: string
}

const navigation: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Clientes", icon: Building2 },
  { label: "Pedidos", icon: ClipboardList },
  { label: "Negociaciones", icon: Handshake },
  { label: "Condiciones", icon: FileSliders },
  { label: "Historial", icon: History },
]

const orders: Order[] = [
  {
    id: "AY-1287",
    client: "Distribuidora Norte",
    state: "Armado",
    packages: 16,
    date: "01 May",
  },
  {
    id: "AY-1288",
    client: "Kiosco La Terminal",
    state: "Armado",
    packages: 9,
    date: "01 May",
    warning: "Stock parcial pendiente",
  },
  {
    id: "AY-1281",
    client: "Supermercado Diaz",
    state: "Negociacion",
    packages: 22,
    date: "30 Abr",
    warning: "Requiere aprobacion de descuento",
  },
  {
    id: "AY-1279",
    client: "Almacen Sur",
    state: "Negociacion",
    packages: 13,
    date: "30 Abr",
    warning: "Sin respuesta hace 26h",
  },
  {
    id: "AY-1284",
    client: "Autoservicio Mitre",
    state: "Confirmado",
    packages: 18,
    date: "01 May",
  },
  {
    id: "AY-1283",
    client: "Mayorista del Este",
    state: "Confirmado",
    packages: 31,
    date: "01 May",
    warning: "Validar ventana de entrega",
  },
  {
    id: "AY-1268",
    client: "Mercado Central B2",
    state: "Entregado",
    packages: 25,
    date: "29 Abr",
  },
  {
    id: "AY-1261",
    client: "Despensa San Martin",
    state: "Entregado",
    packages: 7,
    date: "28 Abr",
  },
]

const stateConfig: Record<
  OrderState,
  {
    icon: LucideIcon
    color: string
    dot: string
    label: string
  }
> = {
  Armado: {
    icon: Package,
    color: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300",
    label: "Armado",
  },
  Negociacion: {
    icon: Handshake,
    color: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    dot: "bg-amber-300",
    label: "Negociacion",
  },
  Confirmado: {
    icon: CheckCircle2,
    color: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    dot: "bg-emerald-300",
    label: "Confirmado",
  },
  Entregado: {
    icon: Truck,
    color: "border-slate-500/30 bg-slate-500/10 text-slate-200",
    dot: "bg-slate-300",
    label: "Entregado",
  },
}

const alerts: {
  title: string
  detail: string
  severity: AlertSeverity
  icon: LucideIcon
}[] = [
  {
    title: "Pedidos que requieren aprobacion",
    detail: "2 negociaciones superan el margen operativo permitido.",
    severity: "critica",
    icon: ShieldAlert,
  },
  {
    title: "Clientes sin condiciones",
    detail: "4 cuentas activas no tienen condicion comercial definida.",
    severity: "media",
    icon: FileSliders,
  },
  {
    title: "Pedidos sin respuesta",
    detail: "2 pedidos llevan mas de 24h esperando confirmacion.",
    severity: "info",
    icon: Clock3,
  },
]

const modulePreviews: {
  title: string
  detail: string
  icon: LucideIcon
}[] = [
  {
    title: "Clientes",
    detail: "Ficha comercial, estado operativo y condiciones vigentes.",
    icon: Users,
  },
  {
    title: "Pedido Nuevo",
    detail: "Carga guiada de bultos, cliente, fecha y observaciones.",
    icon: ShoppingCart,
  },
  {
    title: "Negociacion",
    detail: "Seguimiento de descuentos, aprobaciones y respuestas.",
    icon: Handshake,
  },
  {
    title: "Condiciones Comerciales",
    detail: "Reglas por cliente, volumen, plazo y excepciones.",
    icon: FileSliders,
  },
  {
    title: "Historial",
    detail: "Linea de tiempo de pedidos, cambios y entregas.",
    icon: History,
  },
]

const activeOrders = orders.filter((order) => order.state !== "Entregado")
const negotiatingOrders = orders.filter((order) => order.state === "Negociacion")
const confirmedToday = orders.filter(
  (order) => order.state === "Confirmado" && order.date === "01 May"
)
const activeClients = new Set(activeOrders.map((order) => order.client)).size

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[272px_1fr]">
        <aside className="border-b border-white/10 bg-[#090d16]/95 px-5 py-5 xl:border-b-0 xl:border-r xl:px-6">
          <div className="flex items-center justify-between xl:block">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                  <RadioTower className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-[0.16em] text-white">
                    AYRO NEXO
                  </h1>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/70">
                    Bloque Negro
                  </p>
                </div>
              </div>
            </div>

            <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200 xl:mt-7">
              Online
            </Badge>
          </div>

          <nav className="mt-6 grid gap-2 sm:grid-cols-3 xl:mt-10 xl:block xl:space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon

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
              Pulso operativo
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bultos activos</span>
                <span className="font-semibold text-white">
                  {activeOrders.reduce((acc, order) => acc + order.packages, 0)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900">
                <div className="h-2 w-3/4 rounded-full bg-cyan-300" />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Vista local con datos mockeados. Sin backend ni persistencia.
              </p>
            </div>
          </div>
        </aside>

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/75">
                Centro de comando comercial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Operacion AYRO en vivo
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Pedidos, negociaciones, condiciones y alertas en una sola vista
                operativa.
              </p>
            </div>

            <Button className="h-10 w-fit rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Pedido
            </Button>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              title="Pedidos activos"
              value={String(activeOrders.length)}
              helper="Sin contar entregados"
              icon={Package}
              accent="cyan"
            />
            <Metric
              title="En negociacion"
              value={String(negotiatingOrders.length)}
              helper="Pendientes de cierre"
              icon={Handshake}
              accent="amber"
            />
            <Metric
              title="Confirmados hoy"
              value={String(confirmedToday.length)}
              helper="Listos para despacho"
              icon={CheckCircle2}
              accent="emerald"
            />
            <Metric
              title="Clientes activos"
              value={String(activeClients)}
              helper="Con pedidos abiertos"
              icon={Users}
              accent="violet"
            />
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-[1fr_380px]">
            <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0 shadow-2xl shadow-black/25">
              <CardHeader className="border-b border-white/10 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-white">
                      Pedidos por estado
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-400">
                      Kanban operativo con datos locales.
                    </p>
                  </div>
                  <Badge className="w-fit border-white/10 bg-white/[0.06] text-slate-300">
                    {orders.length} pedidos mock
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-4">
                {(["Armado", "Negociacion", "Confirmado", "Entregado"] as const).map(
                  (state) => (
                    <OrderColumn key={state} state={state} />
                  )
                )}
              </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-1">
              <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
                <CardHeader className="border-b border-white/10 px-5 py-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Alertas operativas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {alerts.map((alert) => (
                    <OperationalAlert key={alert.title} alert={alert} />
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
                <CardHeader className="border-b border-white/10 px-5 py-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Actividad reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {[
                    "Pedido AY-1284 confirmado",
                    "Condicion revisada para Mayorista del Este",
                    "Negociacion AY-1279 sin respuesta",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                      <p className="text-sm leading-5 text-slate-300">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {modulePreviews.map((module) => {
              const Icon = module.icon

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
  accent: "cyan" | "amber" | "emerald" | "violet"
}) {
  const accents = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  }

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
            accents[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function OrderColumn({ state }: { state: OrderState }) {
  const config = stateConfig[state]
  const Icon = config.icon
  const filteredOrders = orders.filter((order) => order.state === state)

  return (
    <section className="min-h-[360px] rounded-lg border border-white/10 bg-[#080c14] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
          <h3 className="truncate text-sm font-semibold text-white">
            {config.label}
          </h3>
        </div>
        <Badge className={cn("border", config.color)}>
          <Icon className="h-3 w-3" />
          {filteredOrders.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-lg border border-white/10 bg-white/[0.035] p-3 shadow-lg shadow-black/15"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {order.client}
                </p>
                <p className="mt-1 text-xs text-slate-500">{order.id}</p>
              </div>
              <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-slate-300">
                {order.date}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
              <span>{order.packages} bultos</span>
              <span>{stateConfig[order.state].label}</span>
            </div>

            {order.warning ? (
              <div className="mt-3 flex gap-2 rounded-md border border-amber-300/20 bg-amber-300/10 p-2 text-xs leading-4 text-amber-100">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{order.warning}</span>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function OperationalAlert({
  alert,
}: {
  alert: {
    title: string
    detail: string
    severity: AlertSeverity
    icon: LucideIcon
  }
}) {
  const Icon = alert.icon
  const severity = {
    critica: {
      label: "Critica",
      className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
      iconClassName: "text-rose-200",
    },
    media: {
      label: "Media",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
      iconClassName: "text-amber-200",
    },
    info: {
      label: "Info",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
      iconClassName: "text-cyan-200",
    },
  }[alert.severity]

  return (
    <article className={cn("rounded-lg border p-3", severity.className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", severity.iconClassName)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
            <span className="rounded-md bg-black/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">
              {severity.label}
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-300">{alert.detail}</p>
        </div>
      </div>
    </article>
  )
}
