import { KeyValueRow } from "@/components/ayro/shared"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AyroDataset } from "@/domain/types"
import { cn } from "@/lib/utils"

export function CondicionesView({ dataset }: { dataset: AyroDataset }) {
  const clientesCompletos = dataset.clientes.filter(
    (cliente) =>
      cliente.descuentoPermitido !== null && cliente.plazoPermitidoDias !== null
  )
  const clientesIncompletos = dataset.clientes.length - clientesCompletos.length
  const cobertura =
    dataset.clientes.length > 0
      ? Math.round((clientesCompletos.length / dataset.clientes.length) * 100)
      : 0

  return (
    <section className="mt-6 space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <CoverageMetric
          title="Condiciones completas"
          value={clientesCompletos.length}
          helper="Clientes listos para evaluacion automatica"
        />
        <CoverageMetric
          title="Condiciones incompletas"
          value={clientesIncompletos}
          helper="Generan alerta hasta cargar reglas"
          warning={clientesIncompletos > 0}
        />
        <CoverageMetric
          title="Cobertura comercial"
          value={`${cobertura}%`}
          helper="Porcentaje de clientes cubiertos"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {dataset.clientes.map((cliente) => {
          const completa =
            cliente.descuentoPermitido !== null &&
            cliente.plazoPermitidoDias !== null

          return (
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
                      Reglas comerciales usadas para evaluar pedidos.
                    </p>
                  </div>
                  <span
                    className={cn(
                      "w-fit rounded-md border px-2.5 py-1 text-xs font-semibold",
                      completa
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                        : "border-rose-400/30 bg-rose-400/10 text-rose-100"
                    )}
                  >
                    {completa ? "Completa" : "Incompleta"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-3 rounded-lg border border-white/10 bg-slate-950/60 p-4">
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
                  <KeyValueRow label="Responsable" value={cliente.responsable} />
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-sm font-semibold text-white">
                    Impacto operativo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {completa
                      ? "Puede evaluarse automaticamente contra estos limites."
                      : "Genera alerta hasta cargar condiciones comerciales."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function CoverageMetric({
  title,
  value,
  helper,
  warning = false,
}: {
  title: string
  value: string | number
  helper: string
  warning?: boolean
}) {
  return (
    <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
      <CardContent className="p-5">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p
          className={cn(
            "mt-2 text-3xl font-semibold tracking-tight",
            warning ? "text-rose-100" : "text-white"
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  )
}
