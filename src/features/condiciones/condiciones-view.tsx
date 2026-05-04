"use client"

import { useState } from "react"

import { KeyValueRow } from "@/components/ayro/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  AyroDataset,
  Cliente,
  CondicionComercialUpdate,
} from "@/domain/types"
import { cn } from "@/lib/utils"

export function CondicionesView({
  dataset,
  onUpdateCondicion,
}: {
  dataset: AyroDataset
  onUpdateCondicion: (input: CondicionComercialUpdate) => void
}) {
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
        {dataset.clientes.map((cliente) => (
          <CondicionClienteCard
            key={`${cliente.id}-${cliente.descuentoPermitido ?? "none"}-${
              cliente.plazoPermitidoDias ?? "none"
            }`}
            cliente={cliente}
            onUpdateCondicion={onUpdateCondicion}
          />
        ))}
      </div>
    </section>
  )
}

function CondicionClienteCard({
  cliente,
  onUpdateCondicion,
}: {
  cliente: Cliente
  onUpdateCondicion: (input: CondicionComercialUpdate) => void
}) {
  const [descuento, setDescuento] = useState(
    String(cliente.descuentoPermitido ?? 0)
  )
  const [plazo, setPlazo] = useState(String(cliente.plazoPermitidoDias ?? 0))

  const completa =
    cliente.descuentoPermitido !== null && cliente.plazoPermitidoDias !== null
  const descuentoNumero = Math.max(0, Number(descuento))
  const plazoNumero = Math.max(0, Number(plazo))
  const puedeGuardar =
    Number.isFinite(descuentoNumero) && Number.isFinite(plazoNumero)

  const guardarCondiciones = () => {
    if (!puedeGuardar) {
      return
    }

    onUpdateCondicion({
      clienteId: cliente.id,
      descuentoPermitido: descuentoNumero,
      plazoPermitidoDias: plazoNumero,
      responsable: cliente.responsable,
    })
  }

  return (
    <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
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
            label="Descuento actual"
            value={
              cliente.descuentoPermitido === null
                ? "Sin cargar"
                : `${cliente.descuentoPermitido}%`
            }
          />
          <KeyValueRow
            label="Plazo actual"
            value={
              cliente.plazoPermitidoDias === null
                ? "Sin cargar"
                : `${cliente.plazoPermitidoDias} dias`
            }
          />
          <KeyValueRow label="Responsable" value={cliente.responsable} />
        </div>

        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Descuento permitido
            </span>
            <input
              type="number"
              min={0}
              value={descuento}
              onChange={(event) => setDescuento(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Plazo permitido
            </span>
            <input
              type="number"
              min={0}
              value={plazo}
              onChange={(event) => setPlazo(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <Button
            type="button"
            disabled={!puedeGuardar}
            onClick={guardarCondiciones}
            className="h-10 rounded-lg border border-cyan-300/30 bg-cyan-300/15 px-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20"
          >
            Guardar
          </Button>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <p className="text-sm font-semibold text-white">Impacto operativo</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {completa
              ? "Puede evaluarse automaticamente contra estos limites."
              : "Genera alerta hasta cargar condiciones comerciales."}
          </p>
        </div>
      </CardContent>
    </Card>
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

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
