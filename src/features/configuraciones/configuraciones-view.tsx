"use client"

import type { Dispatch, SetStateAction } from "react"

import { KeyValueRow } from "@/components/ayro/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ayroSettings } from "@/domain/settings"
import type {
  AyroPersistenceInfo,
  ConfiguracionLocal,
} from "@/domain/types"

export function ConfiguracionesView({
  config,
  persistence,
  onConfigChange,
  onResetLocalData,
}: {
  config: ConfiguracionLocal
  persistence: AyroPersistenceInfo
  onConfigChange: Dispatch<SetStateAction<ConfiguracionLocal>>
  onResetLocalData?: () => void
}) {
  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-white">
                {ayroSettings.configuracionLocal.title}
              </CardTitle>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                {ayroSettings.configuracionLocal.description}
              </p>
            </div>
            <span className="w-fit rounded-md border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-100">
              {persistence.label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Umbral pedido sin respuesta
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Impacta en alertas abiertas, cola de accion e historial
                  simulado.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
                  {config.pedidoSinRespuestaHoras}h
                </span>
                <Button
                  type="button"
                  onClick={() =>
                    onConfigChange((current) => ({
                      ...current,
                      pedidoSinRespuestaHoras:
                        current.pedidoSinRespuestaHoras === 24 ? 48 : 24,
                    }))
                  }
                  className="h-9 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15"
                >
                  {ayroSettings.configuracionLocal.thresholdToggleLabel}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Umbral cliente dormido
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Marca clientes sin pedidos recientes para seguimiento
                  comercial.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">
                  {config.clienteDormidoDias} dias
                </span>
                <Button
                  type="button"
                  onClick={() =>
                    onConfigChange((current) => ({
                      ...current,
                      clienteDormidoDias:
                        current.clienteDormidoDias === 30 ? 45 : 30,
                    }))
                  }
                  className="h-9 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-300/15"
                >
                  Alternar umbral 30/45 dias
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Responsables disponibles
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {config.responsables.map((responsable) => (
                <span
                  key={responsable}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
                >
                  {responsable}
                </span>
              ))}
            </div>
          </div>

          {onResetLocalData ? (
            <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-4">
              <p className="text-sm font-semibold text-white">
                Reset local de trabajo
              </p>
              <p className="mt-1 text-sm leading-5 text-rose-100/80">
                Restaura datos mock y configuracion inicial. Limpia solo la
                demo local guardada en este navegador.
              </p>
              <Button
                type="button"
                onClick={onResetLocalData}
                className="mt-4 h-9 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 text-sm font-semibold text-rose-100 hover:bg-rose-300/15"
              >
                Resetear datos locales
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-lg border-white/10 bg-white/[0.035] py-0">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">
            Labels operativos
          </CardTitle>
          <p className="text-sm text-slate-400">
            Valores visibles que el cliente podria pedir ajustar sin cambiar
            codigo.
          </p>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <ConfigGroup title="Estados" values={Object.values(config.estadosPedido)} />
          <ConfigGroup
            title="Prioridades"
            values={Object.values(config.prioridades)}
          />
          <ConfigGroup
            title="Severidades"
            values={Object.values(config.severidades)}
          />

          <div className="space-y-3 rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <KeyValueRow label="Persistencia" value={persistence.label} />
            <KeyValueRow label="Fuente actual" value={persistence.sourceLabel} />
            <KeyValueRow label="Backend" value={persistence.backendLabel} />
            <KeyValueRow
              label="Ultima actualizacion"
              value={formatPersistenceDate(persistence.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function formatPersistenceDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function ConfigGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  )
}
