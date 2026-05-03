import type { Negociacion } from "@/domain/types"

export const negociaciones: Negociacion[] = [
  {
    id: "neg_001",
    pedidoId: "ped_001",
    motivo: "Descuento solicitado supera el limite permitido.",
    estado: "pendiente",
    aprobacionRequerida: true,
    responsableAprobacion: "Sofia",
  },
  {
    id: "neg_002",
    pedidoId: "ped_002",
    motivo: "Plazo solicitado supera el limite permitido.",
    estado: "pendiente",
    aprobacionRequerida: true,
    responsableAprobacion: "Sofia",
  },
  {
    id: "neg_003",
    pedidoId: "ped_006",
    motivo: "Pedido sin respuesta del cliente hace mas de 24h.",
    estado: "bloqueada",
    aprobacionRequerida: false,
    responsableAprobacion: "Eli",
    comentarioDecision: "Requiere seguimiento comercial.",
  },
]
