import type {
  AccionOperativa,
  AlertaOperativa,
  Cliente,
  ConfiguracionLocal,
  EvaluacionPedido,
  EventoHistorial,
  Negociacion,
  Pedido,
  PedidoDraft,
  PrioridadOperativa,
} from "@/domain/types"

const prioridadRank: Record<PrioridadOperativa, number> = {
  alta: 3,
  media: 2,
  baja: 1,
}

export function evaluarPedido(
  pedido: Pedido | PedidoDraft,
  cliente: Cliente | undefined
): EvaluacionPedido {
  if (!cliente) {
    return {
      estadoSugerido: "Bloqueado",
      motivo: "Pedido sin cliente asociado",
      requiereAprobacion: false,
    }
  }

  if (
    cliente.descuentoPermitido === null ||
    cliente.plazoPermitidoDias === null
  ) {
    return {
      estadoSugerido: "Negociacion",
      motivo: "Cliente sin condiciones comerciales",
      requiereAprobacion: true,
    }
  }

  if (pedido.descuentoSolicitado > cliente.descuentoPermitido) {
    return {
      estadoSugerido: "Negociacion",
      motivo: "Descuento solicitado supera el limite permitido",
      requiereAprobacion: true,
    }
  }

  if (pedido.plazoSolicitadoDias > cliente.plazoPermitidoDias) {
    return {
      estadoSugerido: "Negociacion",
      motivo: "Plazo solicitado supera el limite permitido",
      requiereAprobacion: true,
    }
  }

  return {
    estadoSugerido: "Confirmado",
    motivo: "Pedido dentro de condiciones comerciales",
    requiereAprobacion: false,
  }
}

export function generarAlertasOperativas(
  pedidos: Pedido[],
  clientes: Cliente[],
  negociaciones: Negociacion[],
  config?: Pick<ConfiguracionLocal, "pedidoSinRespuestaHoras">
): AlertaOperativa[] {
  const umbralSinRespuesta = config?.pedidoSinRespuestaHoras ?? 24

  const alertasClientes = clientes
    .filter(
      (cliente) =>
        cliente.descuentoPermitido === null || cliente.plazoPermitidoDias === null
    )
    .map<AlertaOperativa>((cliente) => ({
      id: `alert_cliente_${cliente.id}`,
      tipo: "cliente-sin-condiciones",
      titulo: `${cliente.nombre} no tiene condiciones comerciales`,
      detalle: "Definir descuento y plazo permitido antes de avanzar pedidos.",
      severidad: "alta",
      entidadAsociada: "cliente",
      entidadId: cliente.id,
      responsable: cliente.responsable,
      estado: "abierta",
      accionSugerida: "Cargar condiciones comerciales",
    }))

  const alertasPedidos = pedidos.flatMap<AlertaOperativa>((pedido) => {
    const cliente = clientes.find((item) => item.id === pedido.clienteId)
    const evaluacion = evaluarPedido(pedido, cliente)
    const alertas: AlertaOperativa[] = []

    if (evaluacion.requiereAprobacion && pedido.estado !== "Entregado") {
      alertas.push({
        id: `alert_aprobacion_${pedido.id}`,
        tipo: "aprobacion",
        titulo: `${cliente?.nombre ?? "Cliente sin identificar"} requiere aprobacion`,
        detalle: evaluacion.motivo,
        severidad: "critica",
        entidadAsociada: "pedido",
        entidadId: pedido.id,
        responsable: pedido.responsable,
        estado: "abierta",
        accionSugerida: "Revisar negociacion comercial",
      })
    }

    if (
      pedido.ultimaRespuestaHoras > umbralSinRespuesta &&
      pedido.estado !== "Entregado"
    ) {
      alertas.push({
        id: `alert_respuesta_${pedido.id}`,
        tipo: "pedido-sin-respuesta",
        titulo: `${cliente?.nombre ?? "Cliente sin identificar"} sin respuesta`,
        detalle: `Pedido sin respuesta hace ${pedido.ultimaRespuestaHoras}h.`,
        severidad: pedido.prioridad === "alta" ? "critica" : "alta",
        entidadAsociada: "pedido",
        entidadId: pedido.id,
        responsable: pedido.responsable,
        estado: "abierta",
        accionSugerida: "Contactar responsable y destrabar respuesta",
      })
    }

    return alertas
  })

  const alertasNegociaciones = negociaciones
    .filter((negociacion) => negociacion.estado === "bloqueada")
    .map<AlertaOperativa>((negociacion) => ({
      id: `alert_bloqueo_${negociacion.id}`,
      tipo: "pedido-bloqueado",
      titulo: "Negociacion bloqueada",
      detalle: negociacion.comentarioDecision ?? negociacion.motivo,
      severidad: "alta",
      entidadAsociada: "negociacion",
      entidadId: negociacion.id,
      responsable: negociacion.responsableAprobacion,
      estado: "abierta",
      accionSugerida: "Resolver bloqueo comercial",
    }))

  return [...alertasClientes, ...alertasPedidos, ...alertasNegociaciones]
}

export function construirColaAccion(
  pedidos: Pedido[],
  clientes: Cliente[],
  negociaciones: Negociacion[],
  config?: Pick<ConfiguracionLocal, "pedidoSinRespuestaHoras">
): AccionOperativa[] {
  const alertas = generarAlertasOperativas(
    pedidos,
    clientes,
    negociaciones,
    config
  )
  const accionesDesdeAlertas = alertas.map<AccionOperativa>((alerta) => ({
    id: `accion_${alerta.id}`,
    titulo: alerta.titulo,
    detalle: alerta.detalle,
    prioridad:
      alerta.severidad === "critica" || alerta.severidad === "alta"
        ? "alta"
        : "media",
    responsable: alerta.responsable,
    origen: "alerta",
    entidadId: alerta.entidadId,
    accionSugerida: alerta.accionSugerida,
  }))

  const accionesDesdeNegociaciones = negociaciones
    .filter((negociacion) => negociacion.estado === "pendiente")
    .map<AccionOperativa>((negociacion) => {
      const pedido = pedidos.find((item) => item.id === negociacion.pedidoId)
      const cliente = clientes.find((item) => item.id === pedido?.clienteId)

      return {
        id: `accion_negociacion_${negociacion.id}`,
        titulo: `Aprobar negociacion de ${
          cliente?.nombre ?? "cliente sin identificar"
        }`,
        detalle: negociacion.motivo,
        prioridad: pedido?.prioridad ?? "media",
        responsable: negociacion.responsableAprobacion,
        origen: "negociacion",
        entidadId: negociacion.id,
        accionSugerida: "Aprobar o rechazar excepcion",
      }
    })

  return [...accionesDesdeAlertas, ...accionesDesdeNegociaciones].sort(
    (a, b) => prioridadRank[b.prioridad] - prioridadRank[a.prioridad]
  )
}

export function generarHistorialSimulado(
  historialBase: EventoHistorial[],
  alertas: AlertaOperativa[]
): EventoHistorial[] {
  const eventosAlertas = alertas.map<EventoHistorial>((alerta, index) => ({
    id: `evt_alerta_generada_${index + 1}`,
    entidad: "alerta",
    entidadId: alerta.id,
    accion: "Alerta abierta",
    fecha: "2026-05-03 11:00",
    responsable: alerta.responsable,
    detalle: `${alerta.titulo}: ${alerta.accionSugerida}`,
  }))

  return [...eventosAlertas, ...historialBase]
}
