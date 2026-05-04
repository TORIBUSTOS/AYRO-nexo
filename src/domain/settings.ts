import type {
  AyroViewId,
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

export type DashboardMetricKey =
  | "pedidosActivos"
  | "pedidosEnNegociacion"
  | "pedidosConfirmados"
  | "pedidosEntregados"
  | "clientesActivos"
  | "alertasAbiertas"

type NavigationItem = {
  id: AyroViewId
  label: string
  icon: AyroIconKey
}

type ModulePreview = {
  title: string
  detail: string
  icon: AyroIconKey
}

type DashboardMetric = {
  key: DashboardMetricKey
  title: string
  helper: string
  icon: AyroIconKey
  accent: MetricAccent
}

export const ayroSettings = {
  app: {
    name: "AYRO NEXO",
    subtitle: "Bloque Negro",
    description: "Centro de comando comercial",
  },
  dashboard: {
    title: "Operacion AYRO en vivo",
    description:
      "Pedidos, negociaciones, condiciones y alertas en una sola vista operativa.",
    primaryAction: "Nuevo Pedido",
    onlineLabel: "Online",
    pulseTitle: "Pulso operativo",
    activePackagesLabel: "Bultos activos",
    localDataNote:
      "Demo local persistente con datos mockeados. Sin backend real todavia.",
    kanbanTitle: "Pedidos por estado",
    kanbanDescription: "Kanban operativo con datos locales.",
    mockOrdersLabel: "pedidos mock",
    actionQueueTitle: "Cola de accion",
    actionQueueDescription: "Que hay que resolver ahora, ordenado por prioridad.",
    alertsTitle: "Alertas operativas",
    historyTitle: "Historial reciente",
    moduleSectionTitle: "Modulos operativos",
    labels: {
      action: "Accion",
      bultos: "bultos",
      date: "Fecha",
      priority: "Prioridad",
      responsible: "Responsable",
      state: "Estado",
    },
  },
  views: {
    dashboard: {
      title: "Operacion AYRO en vivo",
      description:
        "Pedidos, negociaciones, condiciones y alertas en una sola vista operativa.",
    },
    clientes: {
      title: "Clientes",
      description:
        "Estado comercial, responsable y condiciones operativas por cliente.",
    },
    pedidos: {
      title: "Pedidos",
      description:
        "Carga simulada, seguimiento y evaluacion comercial de pedidos.",
    },
    negociaciones: {
      title: "Negociaciones",
      description: "Excepciones comerciales, aprobaciones y bloqueos activos.",
    },
    condiciones: {
      title: "Condiciones Comerciales",
      description:
        "Limites comerciales por cliente y brechas que requieren carga.",
    },
    historial: {
      title: "Historial",
      description:
        "Linea de tiempo completa de eventos comerciales y operativos.",
    },
    configuraciones: {
      title: "Configuraciones",
      description:
        "Valores ajustables del sistema para evitar cambios chicos en codigo.",
    },
  },
  configuracionLocal: {
    title: "Configuracion local persistente",
    description:
      "Estos valores persisten en este navegador y preparan el modelo configurable del sistema.",
    noPersistenceLabel: "Persistencia local activa",
    thresholdToggleLabel: "Alternar umbral 24h/48h",
  },
  operational: {
    pedidoSinRespuestaHoras: 24,
    responsables: ["Eli", "Sofia", "Martin"],
    limitesDefault: {
      descuentoPermitido: 0,
      plazoPermitidoDias: 0,
    },
    clienteDormidoDias: 30,
  },
  metrics: [
    {
      key: "pedidosActivos",
      title: "Pedidos activos",
      helper: "Sin contar entregados",
      icon: "package",
      accent: "cyan",
    },
    {
      key: "pedidosEnNegociacion",
      title: "En negociacion",
      helper: "Requieren decision",
      icon: "handshake",
      accent: "amber",
    },
    {
      key: "pedidosConfirmados",
      title: "Confirmados",
      helper: "Listos para entrega",
      icon: "check",
      accent: "emerald",
    },
    {
      key: "pedidosEntregados",
      title: "Entregados",
      helper: "Operacion cerrada",
      icon: "truck",
      accent: "slate",
    },
    {
      key: "clientesActivos",
      title: "Clientes activos",
      helper: "Con operacion vigente",
      icon: "users",
      accent: "violet",
    },
    {
      key: "alertasAbiertas",
      title: "Alertas abiertas",
      helper: "Requieren accion",
      icon: "shield",
      accent: "rose",
    },
  ] satisfies DashboardMetric[],
  navigation: [
    { id: "dashboard", label: "Dashboard", icon: "layout" },
    { id: "clientes", label: "Clientes", icon: "building" },
    { id: "pedidos", label: "Pedidos", icon: "clipboard" },
    { id: "negociaciones", label: "Negociaciones", icon: "handshake" },
    { id: "condiciones", label: "Condiciones", icon: "sliders" },
    { id: "historial", label: "Historial", icon: "history" },
    { id: "configuraciones", label: "Configuraciones", icon: "settings" },
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
