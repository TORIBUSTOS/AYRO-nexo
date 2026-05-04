"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getHistorialOperativo } from "@/domain/selectors"
import type {
  AyroDataset,
  ConfiguracionLocal,
  EventoHistorial,
} from "@/domain/types"
import { cn } from "@/lib/utils"

type HistorialFiltro = EventoHistorial["entidad"] | "todos"

const filtros: Array<{ id: HistorialFiltro; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "cliente", label: "Cliente" },
  { id: "pedido", label: "Pedido" },
  { id: "negociacion", label: "Negociacion" },
  { id: "alerta", label: "Alerta" },
]

const entidadConfig: Record<
  EventoHistorial["entidad"],
  { label: string; className: string; dotClassName: string }
> = {
  cliente: {
    label: "Cliente",
    className: "border-violet-400/30 bg-violet-400/10 text-violet-100",
    dotClassName: "bg-violet-300",
  },
  pedido: {
    label: "Pedido",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
    dotClassName: "bg-cyan-300",
  },
  negociacion: {
    label: "Negociacion",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    dotClassName: "bg-amber-300",
  },
  alerta: {
    label: "Alerta",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
    dotClassName: "bg-rose-300",
  },
}

export function HistorialView({
  dataset,
  config,
}: {
  dataset: AyroDataset
  config: ConfiguracionLocal
}) {
  const [filtro, setFiltro] = useState<HistorialFiltro>("todos")
  const historialCompleto = getHistorialOperativo(dataset, config)

  const historialFiltrado = useMemo(
    () =>
      filtro === "todos"
        ? historialCompleto
        : historialCompleto.filter((evento) => evento.entidad === filtro),
    [filtro, historialCompleto]
  )

  return (
    <section className="mt-6 space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Historial operativo completo
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            Incluye eventos base y eventos simulados desde alertas actuales.
          </p>
        </div>
        <span className="w-fit rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
          {historialFiltrado.length} eventos
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtros.map((item) => (
          <Button
            key={item.id}
            type="button"
            onClick={() => setFiltro(item.id)}
            className={cn(
              "h-9 rounded-lg border px-3 text-sm",
              filtro === item.id
                ? "border-cyan-300/35 bg-cyan-300/15 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {historialFiltrado.map((evento) => {
          const entidad = entidadConfig[evento.entidad]

          return (
            <Card
              key={evento.id}
              className="rounded-lg border-white/10 bg-white/[0.035] py-0"
            >
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn("mt-1 h-3 w-3 rounded-full", entidad.dotClassName)}
                    />
                    <span className="mt-2 h-full w-px bg-white/10" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {evento.accion}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {evento.detalle}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "w-fit rounded-md border px-2.5 py-1 text-xs font-semibold",
                          entidad.className
                        )}
                      >
                        {entidad.label}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Responsable: {evento.responsable}</span>
                      <span>Fecha: {evento.fecha}</span>
                      <span>Entidad ID: {evento.entidadId}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
