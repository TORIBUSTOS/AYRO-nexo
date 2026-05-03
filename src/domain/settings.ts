import type {
  PedidoEstado,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"

export type AyroIconKey =
  | "layout"
  | "building"
  | "clipboard"
  | "handshake"
  | "sliders"
  | "history"
  | "settings"
  | "shoppingCart"
  | "users"
  | "shield"
  | "package"
  | "check"
  | "truck"

export type MetricAccent =
  | "cyan"
  | "amber"
  | "emerald"
  | "violet"
  | "slate"
  | "rose"

type NavigationItem = {
  label: string
  icon: AyroIconKey
  active?: boolean
}

type ModulePreview = {
  title: string
  detail: string
  icon: AyroIconKey
}

export const ayroSettings = {
  app: {
    name: "AYRO NEXO",
    subtitle: "Bloque Negro",
    description: "Centro de comando comercial",
  },
  operational: {
    pedidoSinRespuestaHoras: 24,
    responsables: ["Eli", "Sofia", "Martin"],
    limitesDefault: {
      descuentoPermitido: 0,
      plazoPermitidoDias: 0,
    },
  },
  navigation: [
    { label: "Dashboard", icon: "layout", active: true },
    { label: "Clientes", icon: "building" },
    { label: "Pedidos", icon: "clipboard" },
    { label: "Negociaciones", icon: "handshake" },
    { label: "Condiciones", icon: "sliders" },
    { label: "Historial", icon: "history" },
    { label: "Configuraciones", icon: "settings" },
  ] satisfies NavigationItem[],
  modules: [
    {
      title: "Clientes",
      detail: "Ficha comercial, estado operativo y condiciones vigentes.",
      icon: "users",
    },
    {
      title: "Pedido Nuevo",
      detail: "Carga guiada de bultos, cliente, fecha y observaciones.",
      icon: "shoppingCart",
    },
    {
      title: "Negociacion",
      detail: "Seguimiento de descuentos, aprobaciones y respuestas.",
      icon: "handshake",
    },
    {
      title: "Condiciones Comerciales",
      detail: "Reglas por cliente, volumen, plazo y excepciones.",
      icon: "sliders",
    },
    {
      title: "Historial",
      detail: "Linea de tiempo de pedidos, cambios y entregas.",
      icon: "history",
    },
    {
      title: "Configuraciones",
      detail: "Ajustes de estados, responsables, prioridades y alertas.",
      icon: "settings",
    },
  ] satisfies ModulePreview[],
  pedidoEstados: {
    Armado: { label: "Armado", icon: "package" },
    Negociacion: { label: "Negociacion", icon: "handshake" },
    Confirmado: { label: "Confirmado", icon: "check" },
    Entregado: { label: "Entregado", icon: "truck" },
  } satisfies Record<PedidoEstado, { label: string; icon: AyroIconKey }>,
  prioridades: {
    alta: { label: "Alta" },
    media: { label: "Media" },
    baja: { label: "Baja" },
  } satisfies Record<PrioridadOperativa, { label: string }>,
  severidades: {
    critica: { label: "Critica" },
    alta: { label: "Alta" },
    media: { label: "Media" },
    baja: { label: "Baja" },
  } satisfies Record<SeveridadAlerta, { label: string }>,
}
