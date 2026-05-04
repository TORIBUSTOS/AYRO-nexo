import { ayroSettings } from "@/domain/settings"
import type { ConfiguracionLocal } from "@/domain/types"

export function getDefaultConfig(): ConfiguracionLocal {
  return {
    responsables: ayroSettings.operational.responsables,
    pedidoSinRespuestaHoras: ayroSettings.operational.pedidoSinRespuestaHoras,
    clienteDormidoDias: ayroSettings.operational.clienteDormidoDias,
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
}
