import { KeyValueRow } from "@/components/ayro/shared"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ayroSettings } from "@/domain/settings"
import { getClientesResumen } from "@/domain/selectors"
import type { AyroDataset } from "@/domain/types"

export function ClientesView({ dataset }: { dataset: AyroDataset }) {
  const clientes = getClientesResumen(dataset)

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-2">
      {clientes.map(
        ({
          cliente,
          pedidos,
          pedidosActivos,
          totalBultosActivos,
          tieneCondiciones,
        }) => (
          <Card
            key={cliente.id}
            className="rounded-lg border-white/10 bg-white/[0.035] py-0"
          >
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    {cliente.nombre}
                  </CardTitle>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {cliente.datosOperativos}
                  </p>
                </div>
                <span className="w-fit rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
                  {cliente.estado}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5">
              <div className="space-y-3 rounded-lg border border-white/10 bg-slate-950/60 p-4">
                <KeyValueRow
                  label={ayroSettings.dashboard.labels.responsible}
                  value={cliente.responsable}
                />
                <KeyValueRow label="Pedidos activos" value={pedidosActivos} />
                <KeyValueRow
                  label="Bultos activos"
                  value={totalBultosActivos}
                />
                <KeyValueRow
                  label="Descuento permitido"
                  value={
                    cliente.descuentoPermitido === null
                      ? "Sin cargar"
                      : `${cliente.descuentoPermitido}%`
                  }
                />
                <KeyValueRow
                  label="Plazo permitido"
                  value={
                    cliente.plazoPermitidoDias === null
                      ? "Sin cargar"
                      : `${cliente.plazoPermitidoDias} dias`
                  }
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                <p className="text-sm font-semibold text-white">Ver detalle</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {tieneCondiciones
                    ? "Listo para operar dentro de condiciones comerciales."
                    : "Requiere condiciones comerciales antes de evaluar pedidos automaticamente."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pedidos.map((pedido) => (
                    <span
                      key={pedido.id}
                      className="rounded-md border border-white/10 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {pedido.id} · {pedido.estado}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </section>
  )
}
