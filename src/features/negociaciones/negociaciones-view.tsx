import { KeyValueRow, PriorityBadge } from "@/components/ayro/shared"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClienteNombre } from "@/domain/selectors"
import type {
  AyroDataset,
  EstadoNegociacion,
  Negociacion,
  Pedido,
} from "@/domain/types"
import { cn } from "@/lib/utils"

const estadosNegociacion: EstadoNegociacion[] = [
  "pendiente",
  "bloqueada",
  "aprobada",
  "rechazada",
]

const estadoConfig: Record<
  EstadoNegociacion,
  { label: string; className: string; accion: string }
> = {
  pendiente: {
    label: "Pendientes",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    accion: "Aprobar o rechazar excepcion",
  },
  bloqueada: {
    label: "Bloqueadas",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
    accion: "Resolver bloqueo comercial",
  },
  aprobada: {
    label: "Aprobadas",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    accion: "Continuar confirmacion de pedido",
  },
  rechazada: {
    label: "Rechazadas",
    className: "border-slate-400/30 bg-slate-400/10 text-slate-200",
    accion: "Registrar decision y avisar al cliente",
  },
}

export function NegociacionesView({ dataset }: { dataset: AyroDataset }) {
  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-2">
      {estadosNegociacion.map((estado) => {
        const negociaciones = dataset.negociaciones.filter(
          (negociacion) => negociacion.estado === estado
        )
        const config = estadoConfig[estado]

        return (
          <Card
            key={estado}
            className="rounded-lg border-white/10 bg-white/[0.035] py-0"
          >
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold text-white">
                  {config.label}
                </CardTitle>
                <span
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-semibold",
                    config.className
                  )}
                >
                  {negociaciones.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {negociaciones.length > 0 ? (
                negociaciones.map((negociacion) => (
                  <NegociacionCard
                    key={negociacion.id}
                    dataset={dataset}
                    negociacion={negociacion}
                    accionSugerida={config.accion}
                  />
                ))
              ) : (
                <p className="rounded-lg border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-500">
                  Sin negociaciones en este estado.
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}

function NegociacionCard({
  dataset,
  negociacion,
  accionSugerida,
}: {
  dataset: AyroDataset
  negociacion: Negociacion
  accionSugerida: string
}) {
  const pedido = dataset.pedidos.find(
    (item) => item.id === negociacion.pedidoId
  )
  const cliente = pedido
    ? getClienteNombre(dataset, pedido.clienteId)
    : "Cliente sin identificar"

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{cliente}</p>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            {negociacion.motivo}
          </p>
        </div>
        {pedido ? <PriorityBadge priority={pedido.prioridad} /> : null}
      </div>

      <div className="mt-4 space-y-3 rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <KeyValueRow label="Pedido asociado" value={negociacion.pedidoId} />
        <KeyValueRow
          label="Responsable aprobacion"
          value={negociacion.responsableAprobacion}
        />
        <KeyValueRow
          label="Aprobacion requerida"
          value={negociacion.aprobacionRequerida ? "Si" : "No"}
        />
        {pedido ? <PedidoMiniDetalle pedido={pedido} /> : null}
      </div>

      <p className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">
        Accion sugerida: {accionSugerida}
      </p>

      {negociacion.comentarioDecision ? (
        <p className="mt-3 text-sm leading-5 text-slate-400">
          {negociacion.comentarioDecision}
        </p>
      ) : null}
    </article>
  )
}

function PedidoMiniDetalle({ pedido }: { pedido: Pedido }) {
  return (
    <>
      <KeyValueRow label="Bultos" value={pedido.bultos} />
      <KeyValueRow label="Fecha" value={pedido.fecha} />
    </>
  )
}
