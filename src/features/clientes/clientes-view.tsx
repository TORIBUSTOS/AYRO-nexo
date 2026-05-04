"use client"

import { useState } from "react"

import { KeyValueRow } from "@/components/ayro/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ayroSettings } from "@/domain/settings"
import { getClientesResumen } from "@/domain/selectors"
import type {
  AyroDataset,
  Cliente,
  ClienteUpdate,
  ConfiguracionLocal,
  EstadoCliente,
  Pedido,
} from "@/domain/types"
import { cn } from "@/lib/utils"

const estadosCliente: EstadoCliente[] = ["activo", "observado", "inactivo"]

export function ClientesView({
  dataset,
  config,
  onUpdateCliente,
}: {
  dataset: AyroDataset
  config: ConfiguracionLocal
  onUpdateCliente: (input: ClienteUpdate) => void
}) {
  const clientes = getClientesResumen(dataset, config)

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-2">
      {clientes.map(
        ({
          cliente,
          pedidos,
          pedidosActivos,
          totalBultosActivos,
          tieneCondiciones,
          ultimoPedido,
          diasDesdeUltimoPedido,
          clienteDormido,
          accionSeguimiento,
        }) => (
          <ClienteCard
            key={`${cliente.id}-${cliente.estado}-${cliente.responsable}`}
            cliente={cliente}
            config={config}
            pedidos={pedidos}
            pedidosActivos={pedidosActivos}
            totalBultosActivos={totalBultosActivos}
            tieneCondiciones={tieneCondiciones}
            ultimoPedido={ultimoPedido}
            diasDesdeUltimoPedido={diasDesdeUltimoPedido}
            clienteDormido={clienteDormido}
            accionSeguimiento={accionSeguimiento}
            onUpdateCliente={onUpdateCliente}
          />
        )
      )}
    </section>
  )
}

function ClienteCard({
  cliente,
  config,
  pedidos,
  pedidosActivos,
  totalBultosActivos,
  tieneCondiciones,
  ultimoPedido,
  diasDesdeUltimoPedido,
  clienteDormido,
  accionSeguimiento,
  onUpdateCliente,
}: {
  cliente: Cliente
  config: ConfiguracionLocal
  pedidos: Pedido[]
  pedidosActivos: number
  totalBultosActivos: number
  tieneCondiciones: boolean
  ultimoPedido: Pedido | null
  diasDesdeUltimoPedido: number | null
  clienteDormido: boolean
  accionSeguimiento: string
  onUpdateCliente: (input: ClienteUpdate) => void
}) {
  const [estado, setEstado] = useState<EstadoCliente>(cliente.estado)
  const [responsable, setResponsable] = useState(cliente.responsable)
  const sinCambios = estado === cliente.estado && responsable === cliente.responsable

  const guardarCliente = () => {
    if (sinCambios) {
      return
    }

    onUpdateCliente({
      clienteId: cliente.id,
      estado,
      responsable,
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
          <KeyValueRow label="Bultos activos" value={totalBultosActivos} />
          <KeyValueRow
            label="Ultimo pedido"
            value={ultimoPedido ? ultimoPedido.fecha : "Sin pedidos"}
          />
          <KeyValueRow
            label="Dias sin pedido"
            value={
              diasDesdeUltimoPedido === null
                ? "Sin historial"
                : `${diasDesdeUltimoPedido} dias`
            }
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

        <div
          className={cn(
            "rounded-lg border p-4",
            clienteDormido
              ? "border-amber-300/25 bg-amber-300/10"
              : "border-emerald-300/20 bg-emerald-300/10"
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  clienteDormido ? "text-amber-100" : "text-emerald-100"
                )}
              >
                {clienteDormido ? "Cliente dormido" : "Seguimiento al dia"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {accionSeguimiento}
              </p>
            </div>
            <span
              className={cn(
                "w-fit rounded-md border px-2.5 py-1 text-xs font-semibold",
                clienteDormido
                  ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                  : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
              )}
            >
              {diasDesdeUltimoPedido === null
                ? "Sin historial"
                : `${diasDesdeUltimoPedido} dias`}
            </span>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Estado</span>
            <select
              value={estado}
              onChange={(event) => setEstado(event.target.value as EstadoCliente)}
              className={fieldClassName}
            >
              {estadosCliente.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Responsable
            </span>
            <select
              value={responsable}
              onChange={(event) => setResponsable(event.target.value)}
              className={fieldClassName}
            >
              {config.responsables.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            disabled={sinCambios}
            onClick={guardarCliente}
            className="h-10 rounded-lg border border-cyan-300/30 bg-cyan-300/15 px-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20"
          >
            Guardar cliente
          </Button>
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
}

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
