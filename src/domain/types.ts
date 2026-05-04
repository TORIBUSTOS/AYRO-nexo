export type PedidoEstado = "Armado" | "Negociacion" | "Confirmado" | "Entregado"

export type PrioridadOperativa = "alta" | "media" | "baja"

export type SeveridadAlerta = "critica" | "alta" | "media" | "baja"

export type EstadoCliente = "activo" | "observado" | "inactivo"

export type EstadoNegociacion = "pendiente" | "aprobada" | "rechazada" | "bloqueada"

export type EstadoAlerta = "abierta" | "resuelta"

export type AyroViewId =
  | "dashboard"
  | "clientes"
  | "pedidos"
  | "negociaciones"
  | "condiciones"
  | "historial"
  | "configuraciones"

export type Cliente = {
  id: string
  nombre: string
  estado: EstadoCliente
  responsable: string
  datosOperativos: string
  descuentoPermitido: number | null
  plazoPermitidoDias: number | null
}

export type Pedido = {
  id: string
  clienteId: string
  bultos: number
  fecha: string
  estado: PedidoEstado
  prioridad: PrioridadOperativa
  responsable: string
  observaciones: string
  descuentoSolicitado: number
  plazoSolicitadoDias: number
  ultimaRespuestaHoras: number
}

export type Negociacion = {
  id: string
  pedidoId: string
  motivo: string
  estado: EstadoNegociacion
  aprobacionRequerida: boolean
  responsableAprobacion: string
  decisionTomada?: "aprobada" | "rechazada"
  comentarioDecision?: string
}

export type EventoHistorial = {
  id: string
  entidad: "cliente" | "pedido" | "negociacion" | "alerta"
  entidadId: string
  accion: string
  fecha: string
  responsable: string
  detalle: string
}

export type AlertaOperativa = {
  id: string
  tipo:
    | "aprobacion"
    | "cliente-sin-condiciones"
    | "pedido-sin-respuesta"
    | "pedido-bloqueado"
  titulo: string
  detalle: string
  severidad: SeveridadAlerta
  entidadAsociada: "cliente" | "pedido" | "negociacion"
  entidadId: string
  responsable: string
  estado: EstadoAlerta
  accionSugerida: string
}

export type EvaluacionPedido = {
  estadoSugerido: PedidoEstado | "Bloqueado"
  motivo: string
  requiereAprobacion: boolean
}

export type ConfiguracionLocal = {
  responsables: string[]
  pedidoSinRespuestaHoras: number
  estadosPedido: Record<PedidoEstado, string>
  prioridades: Record<PrioridadOperativa, string>
  severidades: Record<SeveridadAlerta, string>
}

export type PedidoDraft = {
  clienteId: string
  bultos: number
  fecha: string
  prioridad: PrioridadOperativa
  responsable: string
  observaciones: string
  descuentoSolicitado: number
  plazoSolicitadoDias: number
}

export type ResultadoSimulacionPedido = {
  draft: PedidoDraft
  evaluacion: EvaluacionPedido
  alertaPreview?: AlertaOperativa
}

export type PedidoLocalInput = PedidoDraft & {
  estadoInicial: PedidoEstado
}

export type PedidoEstadoUpdate = {
  pedidoId: string
  estado: PedidoEstado
  responsable: string
  detalle: string
}

export type CondicionComercialUpdate = {
  clienteId: string
  descuentoPermitido: number
  plazoPermitidoDias: number
  responsable: string
}

export type ClienteUpdate = {
  clienteId: string
  estado: EstadoCliente
  responsable: string
}

export type NegociacionDecisionInput = {
  negociacionId: string
  decision: "aprobada" | "rechazada"
  responsable: string
  comentario: string
}

export type AccionOperativa = {
  id: string
  titulo: string
  detalle: string
  prioridad: PrioridadOperativa
  responsable: string
  origen: "alerta" | "negociacion" | "pedido"
  entidadId: string
  accionSugerida: string
}

export type AyroDataset = {
  clientes: Cliente[]
  pedidos: Pedido[]
  negociaciones: Negociacion[]
  historial: EventoHistorial[]
}
