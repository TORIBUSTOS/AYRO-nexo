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

export function getClientesResumen(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  const fechaReferencia = getFechaReferenciaOperativa(dataset.pedidos)
  const umbralDormido = config?.clienteDormidoDias ?? 30

  return dataset.clientes.map((cliente) => {
    const pedidos = dataset.pedidos.filter(
      (pedido) => pedido.clienteId === cliente.id
    )
    const pedidosActivos = pedidos.filter(
      (pedido) => pedido.estado !== "Entregado"
    )
    const ultimoPedido = getUltimoPedido(pedidos)
    const diasDesdeUltimoPedido = ultimoPedido
      ? getDiasEntreFechas(ultimoPedido.fecha, fechaReferencia)
      : null
    const clienteDormido =
      diasDesdeUltimoPedido !== null && diasDesdeUltimoPedido >= umbralDormido

    return {
      cliente,
      pedidos,
      pedidosActivos: pedidosActivos.length,
      totalBultosActivos: pedidosActivos.reduce(
        (acc, pedido) => acc + pedido.bultos,
        0
      ),
      tieneCondiciones:
        cliente.descuentoPermitido !== null &&
        cliente.plazoPermitidoDias !== null,
      ultimoPedido,
      diasDesdeUltimoPedido,
      clienteDormido,
      accionSeguimiento: clienteDormido
        ? "Contactar para reactivar compra"
        : "Mantener seguimiento regular",
    }
  })
}

function getUltimoPedido(pedidos: Pedido[]) {
  return pedidos.reduce<Pedido | null>((ultimo, pedido) => {
    if (!ultimo || pedido.fecha > ultimo.fecha) {
      return pedido
    }

    return ultimo
  }, null)
}

function getFechaReferenciaOperativa(pedidos: Pedido[]) {
  const hoy = formatDateOnly(new Date())
  const ultimaFechaPedido = pedidos.reduce<string | null>((ultima, pedido) => {
    if (!ultima || pedido.fecha > ultima) {
      return pedido.fecha
    }

    return ultima
  }, null)

  return ultimaFechaPedido && ultimaFechaPedido > hoy ? ultimaFechaPedido : hoy
}

function getDiasEntreFechas(fechaInicial: string, fechaFinal: string) {
  const inicio = Date.parse(`${fechaInicial}T00:00:00`)
  const fin = Date.parse(`${fechaFinal}T00:00:00`)

  if (Number.isNaN(inicio) || Number.isNaN(fin)) {
    return 0
  }

  return Math.max(0, Math.floor((fin - inicio) / 86_400_000))
}

function formatDateOnly(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
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
