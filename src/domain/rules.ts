import type {
  AccionOperativa,
  AlertaOperativa,
  CategoriaAccionOperativa,
  Cliente,
  ConfiguracionLocal,
  EvaluacionPedido,
  EventoHistorial,
  Negociacion,
  Pedido,
  PedidoDraft,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"

const prioridadRank: Record<PrioridadOperativa, number> = {
  alta: 3,
  media: 2,
  baja: 1,
}

const severidadRank: Record<SeveridadAlerta, number> = {
  critica: 100,
  alta: 75,
  media: 45,
  baja: 20,
}

const DIAS_REPOSICION_RECOMENDADA = 45

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
  config?: Pick<
    ConfiguracionLocal,
    "pedidoSinRespuestaHoras" | "clienteDormidoDias"
  >
): AlertaOperativa[] {
  const umbralSinRespuesta = config?.pedidoSinRespuestaHoras ?? 24
  const umbralDormido = config?.clienteDormidoDias ?? 60
  const fechaReferencia = getFechaReferenciaOperativa(pedidos)

  const alertasClientesSinCondiciones = clientes
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

  const alertasComercialesClientes = clientes.flatMap<AlertaOperativa>((cliente) => {
    const pedidosCliente = pedidos.filter((pedido) => pedido.clienteId === cliente.id)
    const ultimoPedido = getUltimoPedido(pedidosCliente)
    const diasDesdeUltimaCompra = ultimoPedido
      ? getDiasEntreFechas(ultimoPedido.fecha, fechaReferencia)
      : null

    if (!ultimoPedido || diasDesdeUltimaCompra === null) {
      return []
    }

    if (diasDesdeUltimaCompra >= umbralDormido) {
      return [
        {
          id: `alert_cliente_dormido_${cliente.id}`,
          tipo: "cliente-dormido",
          titulo: `${cliente.nombre} esta dormido`,
          detalle: `Ultima compra hace ${diasDesdeUltimaCompra} dias. Riesgo de perder reposicion o frecuencia.`,
          severidad: cliente.estado === "activo" ? "alta" : "media",
          entidadAsociada: "cliente",
          entidadId: cliente.id,
          responsable: cliente.responsable,
          estado: "abierta",
          accionSugerida: "Reactivar con propuesta concreta y promo vigente",
        },
      ]
    }

    if (diasDesdeUltimaCompra >= DIAS_REPOSICION_RECOMENDADA) {
      return [
        {
          id: `alert_reposicion_${cliente.id}`,
          tipo: "oportunidad-reposicion",
          titulo: `${cliente.nombre} listo para reposicion`,
          detalle: `Compra registrada hace ${diasDesdeUltimaCompra} dias. Buen momento para seguimiento comercial.`,
          severidad: "media",
          entidadAsociada: "cliente",
          entidadId: cliente.id,
          responsable: cliente.responsable,
          estado: "abierta",
          accionSugerida: "Ofrecer reposicion y sumar linea complementaria",
        },
      ]
    }

    return []
  })

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

    if (pedido.estado === "Armado" && pedido.ultimaRespuestaHoras > 12) {
      alertas.push({
        id: `alert_seguimiento_${pedido.id}`,
        tipo: "seguimiento-comercial",
        titulo: `${cliente?.nombre ?? "Cliente sin identificar"} tiene pedido armado`,
        detalle: "Hay pedido armado sin avance comercial reciente.",
        severidad: pedido.prioridad === "alta" ? "alta" : "media",
        entidadAsociada: "pedido",
        entidadId: pedido.id,
        responsable: pedido.responsable,
        estado: "abierta",
        accionSugerida: "Pedir definicion y empujar cierre de OC",
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

  return [
    ...alertasClientesSinCondiciones,
    ...alertasComercialesClientes,
    ...alertasPedidos,
    ...alertasNegociaciones,
  ]
}

export function construirColaAccion(
  pedidos: Pedido[],
  clientes: Cliente[],
  negociaciones: Negociacion[],
  config?: Pick<
    ConfiguracionLocal,
    "pedidoSinRespuestaHoras" | "clienteDormidoDias"
  >
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
    prioridad: getPrioridadDesdeSeveridad(alerta.severidad),
    responsable: alerta.responsable,
    origen: "alerta",
    entidadId: alerta.entidadId,
    accionSugerida: alerta.accionSugerida,
    categoria: getCategoriaDesdeAlerta(alerta),
    puntajeComercial: severidadRank[alerta.severidad] + getBonusComercial(alerta),
  }))

  const accionesDesdeNegociaciones = negociaciones
    .filter((negociacion) => negociacion.estado === "pendiente")
    .map<AccionOperativa>((negociacion) => {
      const pedido = pedidos.find((item) => item.id === negociacion.pedidoId)
      const cliente = clientes.find((item) => item.id === pedido?.clienteId)
      const prioridad = pedido?.prioridad ?? "media"

      return {
        id: `accion_negociacion_${negociacion.id}`,
        titulo: `Aprobar negociacion de ${
          cliente?.nombre ?? "cliente sin identificar"
        }`,
        detalle: negociacion.motivo,
        prioridad,
        responsable: negociacion.responsableAprobacion,
        origen: "negociacion",
        entidadId: negociacion.id,
        accionSugerida: "Aprobar o rechazar excepcion",
        categoria: "desbloqueo",
        puntajeComercial: prioridadRank[prioridad] * 20 + 30,
      }
    })

  return [...accionesDesdeAlertas, ...accionesDesdeNegociaciones].sort((a, b) => {
    if (b.puntajeComercial !== a.puntajeComercial) {
      return b.puntajeComercial - a.puntajeComercial
    }

    return prioridadRank[b.prioridad] - prioridadRank[a.prioridad]
  })
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

function getPrioridadDesdeSeveridad(severidad: SeveridadAlerta): PrioridadOperativa {
  if (severidad === "critica" || severidad === "alta") {
    return "alta"
  }

  if (severidad === "media") {
    return "media"
  }

  return "baja"
}

function getCategoriaDesdeAlerta(alerta: AlertaOperativa): CategoriaAccionOperativa {
  if (alerta.tipo === "oportunidad-reposicion") {
    return "reposicion"
  }

  if (alerta.tipo === "cliente-dormido") {
    return "reactivacion"
  }

  if (alerta.tipo === "aprobacion" || alerta.tipo === "pedido-bloqueado") {
    return "desbloqueo"
  }

  if (alerta.tipo === "cliente-sin-condiciones") {
    return "administracion"
  }

  return "cierre"
}

function getBonusComercial(alerta: AlertaOperativa) {
  if (alerta.tipo === "pedido-sin-respuesta") {
    return 20
  }

  if (alerta.tipo === "seguimiento-comercial") {
    return 15
  }

  if (alerta.tipo === "oportunidad-reposicion") {
    return 12
  }

  if (alerta.tipo === "cliente-dormido") {
    return 10
  }

  return 0
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
