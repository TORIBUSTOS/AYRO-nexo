import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const pedidos = [
  { cliente: "Kiosco Norte", estado: "Armado", bultos: 12 },
  { cliente: "Super Díaz", estado: "Negociación", bultos: 18 },
  { cliente: "Almacén Sur", estado: "Confirmado", bultos: 10 },
  { cliente: "Mayorista del Sur", estado: "Negociación", bultos: 24 },
]

const alertas = [
  "3 pedidos requieren aprobación",
  "5 clientes sin condiciones definidas",
  "2 pedidos sin respuesta hace +24h",
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950 p-6">
          <h1 className="text-2xl font-bold tracking-tight">AYRO NEXO</h1>
          <p className="mt-1 text-sm text-slate-400">Sistema comercial</p>

          <nav className="mt-10 space-y-2">
            {["Dashboard", "Clientes", "Pedidos", "Negociaciones", "Condiciones", "Historial"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-900"
                >
                  {item}
                </div>
              )
            )}
          </nav>
        </aside>

        <section className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Hola, Eli 👋</h2>
              <p className="text-slate-400">
                Resumen de la operación comercial de AYRO.
              </p>
            </div>

            <Button className="bg-violet-600 hover:bg-violet-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nuevo Pedido
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Metric title="Pedidos activos" value="18" icon={<Package />} />
            <Metric title="En negociación" value="4" icon={<AlertTriangle />} />
            <Metric title="Confirmados hoy" value="7" icon={<CheckCircle2 />} />
            <Metric title="Clientes activos" value="80+" icon={<Users />} />
          </div>

          <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle>Pedidos por estado</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <PedidoColumna estado="Armado" />
                <PedidoColumna estado="Negociación" />
                <PedidoColumna estado="Confirmado" />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle>Alertas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alertas.map((alerta) => (
                    <div key={alerta} className="flex gap-3 rounded-xl bg-slate-950 p-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <span className="text-sm">{alerta}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle>Actividad reciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-300">
                  <p>Pedido #125 confirmado</p>
                  <p>Nueva negociación creada</p>
                  <p>Condición comercial actualizada</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className="rounded-xl bg-violet-600/20 p-3 text-violet-400">{icon}</div>
      </CardContent>
    </Card>
  )
}

function PedidoColumna({ estado }: { estado: string }) {
  const filtrados = pedidos.filter((p) => p.estado === estado)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{estado}</h3>
        <Badge variant="secondary">{filtrados.length}</Badge>
      </div>

      <div className="space-y-3">
        {filtrados.map((pedido) => (
          <div key={pedido.cliente} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="font-medium">{pedido.cliente}</p>
            <p className="mt-1 text-sm text-slate-400">{pedido.bultos} bultos</p>
            {pedido.estado === "Negociación" && (
              <p className="mt-2 text-xs text-amber-400">
                Requiere aprobación
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}