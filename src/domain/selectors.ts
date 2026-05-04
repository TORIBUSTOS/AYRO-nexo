import type {
  AlertaOperativa,
  AyroDataset,
  ConfiguracionLocal,
  EventoHistorial,
  Pedido,
  PedidoEstado,
  SeveridadAlerta,
} from "@/domain/types"
import {
  construirColaAccion,
  generarAlertasOperativas,
  generarHistorialSimulado,
} from "@/domain/rules"

export function getPedidosPorEstado(pedidos: Pedido[]) {
  return pedidos.reduce<Record<PedidoEstado, Pedido[]>>(
    (acc, pedido) => {
      acc[pedido.estado].push(pedido)
      return acc
    },
    {
      Armado: [],
      Negociacion: [],
      Confirmado: [],
      Entregado: [],
    }
  )
}

export function getMetricasOperativas(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  const pedidosActivos = dataset.pedidos.filter(
    (pedido) => pedido.estado !== "Entregado"
  )
  const pedidosEnNegociacion = dataset.pedidos.filter(
    (pedido) => pedido.estado === "Negociacion"
  )
  const pedidosConfirmados = dataset.pedidos.filter(
    (pedido) => pedido.estado === "Confirmado"
  )
  const pedidosEntregados = dataset.pedidos.filter(
    (pedido) => pedido.estado === "Entregado"
  )
  const clientesActivos = dataset.clientes.filter(
    (cliente) => cliente.estado === "activo"
  )
  const alertasAbiertas = generarAlertasOperativas(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  ).filter((alerta) => alerta.estado === "abierta")

  return {
    pedidosActivos: pedidosActivos.length,
    pedidosEnNegociacion: pedidosEnNegociacion.length,
    pedidosConfirmados: pedidosConfirmados.length,
    pedidosEntregados: pedidosEntregados.length,
    clientesActivos: clientesActivos.length,
    alertasAbiertas: alertasAbiertas.length,
  }
}

export function getAlertasPorSeveridad(alertas: AlertaOperativa[]) {
  return alertas.reduce<Record<SeveridadAlerta, AlertaOperativa[]>>(
    (acc, alerta) => {
      acc[alerta.severidad].push(alerta)
      return acc
    },
    {
      critica: [],
      alta: [],
      media: [],
      baja: [],
    }
  )
}

export function getDashboardData(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  const alertas = generarAlertasOperativas(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  )
  const colaAccion = construirColaAccion(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  )
  const historial = generarHistorialSimulado(dataset.historial, alertas)

  return {
    metricas: getMetricasOperativas(dataset, config),
    pedidosPorEstado: getPedidosPorEstado(dataset.pedidos),
    alertas,
    alertasPorSeveridad: getAlertasPorSeveridad(alertas),
    colaAccion,
    historialReciente: historial.slice(0, 5),
    historialCompleto: historial,
  }
}

export function getClienteNombre(dataset: AyroDataset, clienteId: string) {
  return (
    dataset.clientes.find((cliente) => cliente.id === clienteId)?.nombre ??
    "Cliente sin identificar"
  )
}

export function getHistorialReciente(historial: EventoHistorial[]) {
  return historial.slice(0, 5)
}

export function getHistorialOperativo(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  return getDashboardData(dataset, config).historialCompleto
}
