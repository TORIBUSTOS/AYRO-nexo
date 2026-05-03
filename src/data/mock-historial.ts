import type { EventoHistorial } from "@/domain/types"

export const historial: EventoHistorial[] = [
  {
    id: "evt_001",
    entidad: "pedido",
    entidadId: "ped_004",
    accion: "Pedido confirmado",
    fecha: "2026-05-03 10:15",
    responsable: "Martin",
    detalle: "Pedido dentro de condiciones comerciales.",
  },
  {
    id: "evt_002",
    entidad: "negociacion",
    entidadId: "neg_001",
    accion: "Negociacion creada",
    fecha: "2026-05-03 09:40",
    responsable: "Eli",
    detalle: "Descuento solicitado requiere aprobacion.",
  },
  {
    id: "evt_003",
    entidad: "alerta",
    entidadId: "ped_006",
    accion: "Alerta generada",
    fecha: "2026-05-03 09:10",
    responsable: "Eli",
    detalle: "Pedido lleva mas de 24h sin respuesta.",
  },
]
