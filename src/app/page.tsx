"use client"

import { useMemo, useState } from "react"

import { AyroShell } from "@/components/ayro/ayro-shell"
import { getAyroDataset } from "@/data/source"
import { ayroSettings } from "@/domain/settings"
import type { AyroViewId, ConfiguracionLocal } from "@/domain/types"
import { ClientesView } from "@/features/clientes/clientes-view"
import { CondicionesView } from "@/features/condiciones/condiciones-view"
import { ConfiguracionesView } from "@/features/configuraciones/configuraciones-view"
import { DashboardView } from "@/features/dashboard/dashboard-view"
import { HistorialView } from "@/features/historial/historial-view"
import { NegociacionesView } from "@/features/negociaciones/negociaciones-view"
import { PedidosView } from "@/features/pedidos/pedidos-view"

const initialConfig: ConfiguracionLocal = {
  responsables: ayroSettings.operational.responsables,
  pedidoSinRespuestaHoras: ayroSettings.operational.pedidoSinRespuestaHoras,
  estadosPedido: {
    Armado: ayroSettings.pedidoEstados.Armado.label,
    Negociacion: ayroSettings.pedidoEstados.Negociacion.label,
    Confirmado: ayroSettings.pedidoEstados.Confirmado.label,
    Entregado: ayroSettings.pedidoEstados.Entregado.label,
  },
  prioridades: {
    alta: ayroSettings.prioridades.alta.label,
    media: ayroSettings.prioridades.media.label,
    baja: ayroSettings.prioridades.baja.label,
  },
  severidades: {
    critica: ayroSettings.severidades.critica.label,
    alta: ayroSettings.severidades.alta.label,
    media: ayroSettings.severidades.media.label,
    baja: ayroSettings.severidades.baja.label,
  },
}

export default function Home() {
  const [activeView, setActiveView] = useState<AyroViewId>("dashboard")
  const [config, setConfig] = useState<ConfiguracionLocal>(initialConfig)
  const dataset = useMemo(() => getAyroDataset(), [])

  const activePackages = useMemo(
    () =>
      dataset.pedidos
        .filter((pedido) => pedido.estado !== "Entregado")
        .reduce((acc, pedido) => acc + pedido.bultos, 0),
    [dataset]
  )

  const renderView = () => {
    switch (activeView) {
      case "clientes":
        return <ClientesView dataset={dataset} />
      case "pedidos":
        return <PedidosView dataset={dataset} config={config} />
      case "negociaciones":
        return <NegociacionesView dataset={dataset} />
      case "condiciones":
        return <CondicionesView dataset={dataset} />
      case "configuraciones":
        return (
          <ConfiguracionesView config={config} onConfigChange={setConfig} />
        )
      case "historial":
        return <HistorialView dataset={dataset} config={config} />
      case "dashboard":
      default:
        return <DashboardView dataset={dataset} config={config} />
    }
  }

  return (
    <AyroShell
      activeView={activeView}
      activePackages={activePackages}
      onNavigate={setActiveView}
    >
      {renderView()}
    </AyroShell>
  )
}
