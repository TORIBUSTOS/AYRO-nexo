"use client"

import { useMemo, useState } from "react"

import { AyroShell } from "@/components/ayro/ayro-shell"
import { useAyroDemoState } from "@/data/use-ayro-demo-state"
import {
  createPedidoLocal,
  decidirNegociacion,
  updateCliente,
  updateCondicionComercial,
  updatePedidoEstado,
} from "@/domain/local-operations"
import { getDefaultConfig } from "@/domain/default-config"
import type {
  AyroViewId,
  ClienteUpdate,
  CondicionComercialUpdate,
  NegociacionDecisionInput,
  PedidoEstadoUpdate,
  PedidoLocalInput,
} from "@/domain/types"
import { ClientesView } from "@/features/clientes/clientes-view"
import { CondicionesView } from "@/features/condiciones/condiciones-view"
import { ConfiguracionesView } from "@/features/configuraciones/configuraciones-view"
import { DashboardView } from "@/features/dashboard/dashboard-view"
import { HistorialView } from "@/features/historial/historial-view"
import { NegociacionesView } from "@/features/negociaciones/negociaciones-view"
import { PedidosView } from "@/features/pedidos/pedidos-view"

const initialConfig = getDefaultConfig()

export default function Home() {
  const [activeView, setActiveView] = useState<AyroViewId>("dashboard")
  const {
    dataset,
    config,
    persistence,
    setDataset,
    setConfig,
    resetDemoState,
  } = useAyroDemoState(initialConfig)

  const activePackages = useMemo(
    () =>
      dataset.pedidos
        .filter((pedido) => pedido.estado !== "Entregado")
        .reduce((acc, pedido) => acc + pedido.bultos, 0),
    [dataset]
  )

  const resetearDatosLocales = () => {
    resetDemoState()
  }

  const crearPedidoLocal = (input: PedidoLocalInput) => {
    setDataset((current) => createPedidoLocal(current, input))
  }

  const cambiarEstadoPedido = (input: PedidoEstadoUpdate) => {
    setDataset((current) => updatePedidoEstado(current, input))
  }

  const decidirNegociacionLocal = (input: NegociacionDecisionInput) => {
    setDataset((current) => decidirNegociacion(current, input))
  }

  const actualizarCondicionComercial = (input: CondicionComercialUpdate) => {
    setDataset((current) => updateCondicionComercial(current, input))
  }

  const actualizarCliente = (input: ClienteUpdate) => {
    setDataset((current) => updateCliente(current, input))
  }

  const renderView = () => {
    switch (activeView) {
      case "clientes":
        return (
          <ClientesView
            dataset={dataset}
            config={config}
            onUpdateCliente={actualizarCliente}
          />
        )
      case "pedidos":
        return (
          <PedidosView
            dataset={dataset}
            config={config}
            onCreatePedido={crearPedidoLocal}
            onUpdatePedidoEstado={cambiarEstadoPedido}
          />
        )
      case "negociaciones":
        return (
          <NegociacionesView
            dataset={dataset}
            onDecision={decidirNegociacionLocal}
          />
        )
      case "condiciones":
        return (
          <CondicionesView
            dataset={dataset}
            onUpdateCondicion={actualizarCondicionComercial}
          />
        )
      case "configuraciones":
        return (
          <ConfiguracionesView
            config={config}
            persistence={persistence}
            onConfigChange={setConfig}
            onResetLocalData={resetearDatosLocales}
          />
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
      onPrimaryAction={() => setActiveView("pedidos")}
    >
      {renderView()}
    </AyroShell>
  )
}
