import { getAyroDataset } from "@/data/source"
import type {
  AyroDataset,
  ClienteUpdate,
  CondicionComercialUpdate,
  EventoHistorial,
  NegociacionDecisionInput,
  Pedido,
  PedidoEstadoUpdate,
  PedidoLocalInput,
} from "@/domain/types"

export function createLocalId(prefix: string, count: number) {
  return `${prefix}_${String(count + 1).padStart(3, "0")}`
}

export function createLocalEvent({
  dataset,
  entidad,
  entidadId,
  accion,
  responsable,
  detalle,
}: {
  dataset: AyroDataset
  entidad: EventoHistorial["entidad"]
  entidadId: string
  accion: string
  responsable: string
  detalle: string
}): EventoHistorial {
  return {
    id: createLocalId("evt_local", dataset.historial.length),
    entidad,
    entidadId,
    accion,
    fecha: formatLocalEventDate(new Date()),
    responsable,
    detalle,
  }
}

export function createPedidoLocal(
  dataset: AyroDataset,
  input: PedidoLocalInput
): AyroDataset {
  const pedido: Pedido = {
    id: createLocalId("ped", dataset.pedidos.length),
    clienteId: input.clienteId,
    bultos: input.bultos,
    fecha: input.fecha,
    estado: input.estadoInicial,
    prioridad: input.prioridad,
    responsable: input.responsable,
    observaciones: input.observaciones,
    descuentoSolicitado: input.descuentoSolicitado,
    plazoSolicitadoDias: input.plazoSolicitadoDias,
    ultimaRespuestaHoras: 0,
  }
  const cliente = dataset.clientes.find((item) => item.id === input.clienteId)
  const event = createLocalEvent({
    dataset,
    entidad: "pedido",
    entidadId: pedido.id,
    accion: "Pedido creado",
    responsable: input.responsable,
    detalle: `Pedido local creado para ${
      cliente?.nombre ?? "cliente sin identificar"
    } con ${input.bultos} bultos.`,
  })

  return {
    ...dataset,
    pedidos: [...dataset.pedidos, pedido],
    historial: [event, ...dataset.historial],
  }
}

export function updatePedidoEstado(
  dataset: AyroDataset,
  input: PedidoEstadoUpdate
): AyroDataset {
  const pedido = dataset.pedidos.find((item) => item.id === input.pedidoId)
  const event = createLocalEvent({
    dataset,
    entidad: "pedido",
    entidadId: input.pedidoId,
    accion: "Estado de pedido actualizado",
    responsable: input.responsable,
    detalle:
      input.detalle ||
      `Pedido ${input.pedidoId} movido a estado ${input.estado}.`,
  })

  return {
    ...dataset,
    pedidos: dataset.pedidos.map((item) =>
      item.id === input.pedidoId ? { ...item, estado: input.estado } : item
    ),
    historial: pedido ? [event, ...dataset.historial] : dataset.historial,
  }
}

export function updateCondicionComercial(
  dataset: AyroDataset,
  input: CondicionComercialUpdate
): AyroDataset {
  const cliente = dataset.clientes.find((item) => item.id === input.clienteId)
  const event = createLocalEvent({
    dataset,
    entidad: "cliente",
    entidadId: input.clienteId,
    accion: "Condiciones actualizadas",
    responsable: input.responsable,
    detalle: `Condiciones comerciales actualizadas: ${input.descuentoPermitido}% y ${input.plazoPermitidoDias} dias.`,
  })

  return {
    ...dataset,
    clientes: dataset.clientes.map((item) =>
      item.id === input.clienteId
        ? {
            ...item,
            descuentoPermitido: input.descuentoPermitido,
            plazoPermitidoDias: input.plazoPermitidoDias,
          }
        : item
    ),
    historial: cliente ? [event, ...dataset.historial] : dataset.historial,
  }
}

export function updateCliente(
  dataset: AyroDataset,
  input: ClienteUpdate
): AyroDataset {
  const cliente = dataset.clientes.find((item) => item.id === input.clienteId)
  const event = createLocalEvent({
    dataset,
    entidad: "cliente",
    entidadId: input.clienteId,
    accion: "Cliente actualizado",
    responsable: input.responsable,
    detalle: `Cliente actualizado a estado ${input.estado} con responsable ${input.responsable}.`,
  })

  return {
    ...dataset,
    clientes: dataset.clientes.map((item) =>
      item.id === input.clienteId
        ? { ...item, estado: input.estado, responsable: input.responsable }
        : item
    ),
    historial: cliente ? [event, ...dataset.historial] : dataset.historial,
  }
}

export function decidirNegociacion(
  dataset: AyroDataset,
  input: NegociacionDecisionInput
): AyroDataset {
  const negociacion = dataset.negociaciones.find(
    (item) => item.id === input.negociacionId
  )
  const accion =
    input.decision === "aprobada"
      ? "Negociacion aprobada"
      : "Negociacion rechazada"
  const event = createLocalEvent({
    dataset,
    entidad: "negociacion",
    entidadId: input.negociacionId,
    accion,
    responsable: input.responsable,
    detalle: input.comentario || accion,
  })

  return {
    ...dataset,
    negociaciones: dataset.negociaciones.map((item) =>
      item.id === input.negociacionId
        ? {
            ...item,
            estado: input.decision,
            decisionTomada: input.decision,
            comentarioDecision: input.comentario,
          }
        : item
    ),
    historial: negociacion ? [event, ...dataset.historial] : dataset.historial,
  }
}

export function resetDataset() {
  return getAyroDataset()
}

function formatLocalEventDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
