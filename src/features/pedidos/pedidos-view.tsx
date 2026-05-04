"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"

import { PriorityBadge, StateBadge } from "@/components/ayro/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { evaluarPedido } from "@/domain/rules"
import { ayroSettings } from "@/domain/settings"
import { getClienteNombre } from "@/domain/selectors"
import type {
  AyroDataset,
  ConfiguracionLocal,
  PedidoDraft,
  PedidoEstado,
  PedidoEstadoUpdate,
  PedidoLocalInput,
  ResultadoSimulacionPedido,
} from "@/domain/types"
import { cn } from "@/lib/utils"

const filtros: Array<PedidoEstado | "Todos"> = [
  "Todos",
  "Armado",
  "Negociacion",
  "Confirmado",
  "Entregado",
]

export function PedidosView({
  dataset,
  config,
  onCreatePedido,
  onUpdatePedidoEstado,
}: {
  dataset: AyroDataset
  config: ConfiguracionLocal
  onCreatePedido: (input: PedidoLocalInput) => void
  onUpdatePedidoEstado: (input: PedidoEstadoUpdate) => void
}) {
  const [estado, setEstado] = useState<PedidoEstado | "Todos">("Todos")
  const [draft, setDraft] = useState<PedidoDraft>(() => ({
    clienteId: dataset.clientes[0]?.id ?? "",
    bultos: 10,
    fecha: "2026-05-03",
    prioridad: "media",
    responsable: config.responsables[0] ?? "Eli",
    observaciones: "Simulacion local de pedido.",
    descuentoSolicitado: 5,
    plazoSolicitadoDias: 15,
  }))
  const [resultado, setResultado] =
    useState<ResultadoSimulacionPedido | null>(null)

  const pedidos = useMemo(
    () =>
      estado === "Todos"
        ? dataset.pedidos
        : dataset.pedidos.filter((pedido) => pedido.estado === estado),
    [dataset.pedidos, estado]
  )

  const clienteSeleccionado = dataset.clientes.find(
    (cliente) => cliente.id === draft.clienteId
  )

  const simularPedido = () => {
    const evaluacion = evaluarPedido(draft, clienteSeleccionado)

    setResultado({
      draft,
      evaluacion,
      alertaPreview: evaluacion.requiereAprobacion
        ? {
            id: "alert_preview_pedido",
            tipo:
              evaluacion.motivo === "Cliente sin condiciones comerciales"
                ? "cliente-sin-condiciones"
                : "aprobacion",
            titulo: `${
              clienteSeleccionado?.nombre ?? "Cliente sin identificar"
            } requiere revision`,
            detalle: evaluacion.motivo,
            severidad: "alta",
            entidadAsociada: "pedido",
            entidadId: "pedido_preview",
            responsable: draft.responsable,
            estado: "abierta",
            accionSugerida:
              evaluacion.motivo === "Cliente sin condiciones comerciales"
                ? "Cargar condiciones comerciales"
                : "Revisar excepcion comercial",
          }
        : undefined,
    })
  }

  const crearPedido = () => {
    if (!resultado) {
      return
    }

    const estadoInicial =
      resultado.evaluacion.estadoSugerido === "Confirmado"
        ? "Confirmado"
        : resultado.evaluacion.estadoSugerido === "Negociacion"
          ? "Negociacion"
          : "Armado"

    onCreatePedido({
      ...resultado.draft,
      estadoInicial,
    })
    setResultado(null)
  }

  const actualizarEstado = (pedidoId: string, estadoDestino: PedidoEstado) => {
    const pedido = dataset.pedidos.find((item) => item.id === pedidoId)

    if (!pedido || pedido.estado === estadoDestino) {
      return
    }

    onUpdatePedidoEstado({
      pedidoId,
      estado: estadoDestino,
      responsable: pedido.responsable,
      detalle: `Pedido movido de ${pedido.estado} a ${estadoDestino}.`,
    })
  }

  return (
    <section className="mt-6 space-y-5">
      <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">
            Pedido Nuevo
          </CardTitle>
          <p className="text-sm leading-6 text-slate-400">
            Simulacion en memoria, no guarda datos. Usa las reglas reales de
            evaluacion comercial.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <select
                value={draft.clienteId}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    clienteId: event.target.value,
                  }))
                }
                className={fieldClassName}
              >
                {dataset.clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Responsable">
              <select
                value={draft.responsable}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    responsable: event.target.value,
                  }))
                }
                className={fieldClassName}
              >
                {config.responsables.map((responsable) => (
                  <option key={responsable} value={responsable}>
                    {responsable}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bultos">
              <input
                type="number"
                min={1}
                value={draft.bultos}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    bultos: Number(event.target.value),
                  }))
                }
                className={fieldClassName}
              />
            </Field>

            <Field label="Fecha">
              <input
                type="date"
                value={draft.fecha}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    fecha: event.target.value,
                  }))
                }
                className={fieldClassName}
              />
            </Field>

            <Field label="Prioridad">
              <select
                value={draft.prioridad}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    prioridad: event.target.value as PedidoDraft["prioridad"],
                  }))
                }
                className={fieldClassName}
              >
                {Object.entries(config.prioridades).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Descuento solicitado">
              <input
                type="number"
                min={0}
                value={draft.descuentoSolicitado}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    descuentoSolicitado: Number(event.target.value),
                  }))
                }
                className={fieldClassName}
              />
            </Field>

            <Field label="Plazo solicitado">
              <input
                type="number"
                min={0}
                value={draft.plazoSolicitadoDias}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    plazoSolicitadoDias: Number(event.target.value),
                  }))
                }
                className={fieldClassName}
              />
            </Field>

            <Field label="Observaciones">
              <input
                value={draft.observaciones}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    observaciones: event.target.value,
                  }))
                }
                className={fieldClassName}
              />
            </Field>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-white">
              Resultado operativo
            </p>
            {resultado ? (
              <div className="mt-4 space-y-3">
                <p className="text-2xl font-semibold text-white">
                  {resultado.evaluacion.estadoSugerido}
                </p>
                <p className="text-sm leading-6 text-slate-400">
                  {resultado.evaluacion.motivo}
                </p>
                <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-300">
                  Accion sugerida:{" "}
                  {resultado.alertaPreview?.accionSugerida ??
                    "Avanzar a confirmacion"}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Completa los datos y simula la evaluacion para ver si el pedido
                confirma o pasa a negociacion.
              </p>
            )}
            <Button
              type="button"
              onClick={simularPedido}
              className="mt-5 h-9 rounded-lg bg-cyan-300 px-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              Simular evaluacion
            </Button>
            {resultado ? (
              <Button
                type="button"
                onClick={crearPedido}
                className="ml-2 mt-5 h-9 rounded-lg border border-emerald-300/30 bg-emerald-300/15 px-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/20"
              >
                Crear pedido local
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {filtros.map((filtro) => (
          <Button
            key={filtro}
            type="button"
            onClick={() => setEstado(filtro)}
            className={cn(
              "h-9 rounded-lg border px-3 text-sm",
              estado === filtro
                ? "border-cyan-300/35 bg-cyan-300/15 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
            )}
          >
            {filtro}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {pedidos.map((pedido) => (
          <Card
            key={pedido.id}
            className="rounded-lg border-white/10 bg-white/[0.035] py-0"
          >
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    {getClienteNombre(dataset, pedido.clienteId)}
                  </CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {pedido.id}
                  </p>
                </div>
                <StateBadge state={pedido.estado} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                <span>
                  {pedido.bultos} {ayroSettings.dashboard.labels.bultos}
                </span>
                <span>
                  {ayroSettings.dashboard.labels.date}: {pedido.fecha}
                </span>
                <span>
                  {ayroSettings.dashboard.labels.responsible}:{" "}
                  {pedido.responsable}
                </span>
              </div>
              <PriorityBadge priority={pedido.prioridad} />
              <p className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm leading-5 text-slate-400">
                {pedido.observaciones}
              </p>
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {filtros
                  .filter((filtro): filtro is PedidoEstado => filtro !== "Todos")
                  .map((estadoDestino) => (
                    <Button
                      key={estadoDestino}
                      type="button"
                      disabled={pedido.estado === estadoDestino}
                      onClick={() => actualizarEstado(pedido.id, estadoDestino)}
                      className={cn(
                        "h-8 rounded-lg border px-2.5 text-xs font-semibold",
                        pedido.estado === estadoDestino
                          ? "cursor-default border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                      )}
                    >
                      {estadoDestino}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  )
}

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
