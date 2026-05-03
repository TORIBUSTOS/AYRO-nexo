# AYRO NEXO Frontend MVP v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build AYRO NEXO Frontend MVP v2 as a decisional operational dashboard with centralized mock data, local business rules, action queue, responsible owners, priorities, kanban, simulated history, and actionable alerts.

**Architecture:** Keep the app frontend-only. Move domain types, mock data, rules, and selectors out of `src/app/page.tsx`, then render the dashboard from derived local data. No backend, database, authentication, Prisma, external APIs, or persistence in this sprint.

**Tech Stack:** Next.js App Router 16.2.4, React 19.2.4, TypeScript strict mode, Tailwind CSS 4, shadcn/ui, lucide-react.

---

## Hard Rule: No Hardcoded UI

`src/app/page.tsx` must not contain hardcoded operational data, business rules, repeated labels, repeated severity/priority mappings, color decisions, or theme decisions.

Required approach:

- Data comes from `src/data`.
- Business behavior comes from `src/domain/rules.ts`.
- Derived dashboard state comes from `src/domain/selectors.ts`.
- Repeated UI labels, visual variants, icon mappings, and color class mappings must live in a reusable config/constant file.
- Client-changeable values must live in configuration, not components.
- `page.tsx` composes sections and components only.

If Task 5 needs colors or variants for severity, priority, metrics, or order states, create a dedicated UI config file instead of embedding those mappings inline in JSX.

Any value the client could reasonably ask to change must be configurable: module labels, order state labels, priority labels, severity labels, visual variants, available owners, response thresholds, suggested action text, and visible system identity.

---

## File Structure

- Create `src/domain/types.ts`: shared domain types for clientes, pedidos, condiciones, negociaciones, historial, alertas, priorities, severities, and evaluation results.
- Create `src/domain/rules.ts`: pure local rules for evaluating pedidos, alert generation, action queue construction, and history generation.
- Create `src/domain/selectors.ts`: pure selectors for metrics, kanban grouping, action ordering, alert grouping, and recent history.
- Create `src/domain/settings.ts`: configurable system identity, navigation, module previews, owners, operational thresholds, labels, and default commercial settings.
- Create `src/domain/ui-config.ts`: shared UI labels, icon keys, and visual class mappings for states, severities, priorities, and metric accents.
- Create `src/data/mock-clientes.ts`: realistic AYRO client mock data with responsible owners and commercial limits.
- Create `src/data/mock-pedidos.ts`: realistic pedidos with priorities, owners, requested discount/term, dates, and observations.
- Create `src/data/mock-negociaciones.ts`: negotiation mock data tied to pedidos.
- Create `src/data/mock-historial.ts`: baseline simulated event history.
- Create `src/data/mock-index.ts`: single data entrypoint exporting the complete local dataset.
- Modify `src/app/page.tsx`: remove inline mocks/types/rules and render Dashboard v2 from centralized data/selectors.
- Keep `BLUEPRINT.md` as product/architecture source of truth.

---

### Task 1: Domain Types

**Files:**
- Create: `src/domain/types.ts`

- [x] **Step 1: Create domain type file**

Add `src/domain/types.ts`:

```ts
export type PedidoEstado = "Armado" | "Negociacion" | "Confirmado" | "Entregado"

export type PrioridadOperativa = "alta" | "media" | "baja"

export type SeveridadAlerta = "critica" | "alta" | "media" | "baja"

export type EstadoCliente = "activo" | "observado" | "inactivo"

export type EstadoNegociacion = "pendiente" | "aprobada" | "rechazada" | "bloqueada"

export type EstadoAlerta = "abierta" | "resuelta"

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
  tipo: "aprobacion" | "cliente-sin-condiciones" | "pedido-sin-respuesta" | "pedido-bloqueado"
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
```

- [x] **Step 2: Verify types compile**

Run:

```bash
npm run build
```

Expected: build passes with no TypeScript errors.

- [x] **Step 3: Commit**

```bash
git add src/domain/types.ts
git commit -m "feat: add AYRO NEXO domain types"
```

---

### Task 2: Centralized Mock Data

**Files:**
- Create: `src/data/mock-clientes.ts`
- Create: `src/data/mock-pedidos.ts`
- Create: `src/data/mock-negociaciones.ts`
- Create: `src/data/mock-historial.ts`
- Create: `src/data/mock-index.ts`

- [x] **Step 1: Add mock clients**

Create `src/data/mock-clientes.ts`:

```ts
import type { Cliente } from "@/domain/types"

export const clientes: Cliente[] = [
  {
    id: "cli_001",
    nombre: "Bazar Norte",
    estado: "activo",
    responsable: "Eli",
    datosOperativos: "Compra semanal con foco en volumen.",
    descuentoPermitido: 10,
    plazoPermitidoDias: 30,
  },
  {
    id: "cli_002",
    nombre: "Supermercado Sur",
    estado: "activo",
    responsable: "Sofia",
    datosOperativos: "Cliente recurrente con entregas coordinadas.",
    descuentoPermitido: 8,
    plazoPermitidoDias: 21,
  },
  {
    id: "cli_003",
    nombre: "Mayorista Centro",
    estado: "observado",
    responsable: "Eli",
    datosOperativos: "Alta rotacion, condiciones pendientes de definir.",
    descuentoPermitido: null,
    plazoPermitidoDias: null,
  },
  {
    id: "cli_004",
    nombre: "Distribuidora Norte",
    estado: "activo",
    responsable: "Martin",
    datosOperativos: "Pedido mayorista con retiro coordinado.",
    descuentoPermitido: 12,
    plazoPermitidoDias: 45,
  },
  {
    id: "cli_005",
    nombre: "Kiosco La Terminal",
    estado: "activo",
    responsable: "Sofia",
    datosOperativos: "Pedidos chicos y frecuentes.",
    descuentoPermitido: 5,
    plazoPermitidoDias: 15,
  },
]
```

- [x] **Step 2: Add mock pedidos**

Create `src/data/mock-pedidos.ts`:

```ts
import type { Pedido } from "@/domain/types"

export const pedidos: Pedido[] = [
  {
    id: "ped_001",
    clienteId: "cli_001",
    bultos: 12,
    fecha: "2026-05-03",
    estado: "Armado",
    prioridad: "alta",
    responsable: "Eli",
    observaciones: "Cliente solicita condicion especial por volumen.",
    descuentoSolicitado: 15,
    plazoSolicitadoDias: 45,
    ultimaRespuestaHoras: 6,
  },
  {
    id: "ped_002",
    clienteId: "cli_002",
    bultos: 18,
    fecha: "2026-05-03",
    estado: "Negociacion",
    prioridad: "alta",
    responsable: "Sofia",
    observaciones: "Pendiente de aprobacion por plazo extendido.",
    descuentoSolicitado: 6,
    plazoSolicitadoDias: 35,
    ultimaRespuestaHoras: 28,
  },
  {
    id: "ped_003",
    clienteId: "cli_003",
    bultos: 24,
    fecha: "2026-05-02",
    estado: "Armado",
    prioridad: "media",
    responsable: "Eli",
    observaciones: "Cliente sin condiciones comerciales cargadas.",
    descuentoSolicitado: 7,
    plazoSolicitadoDias: 20,
    ultimaRespuestaHoras: 4,
  },
  {
    id: "ped_004",
    clienteId: "cli_004",
    bultos: 31,
    fecha: "2026-05-03",
    estado: "Confirmado",
    prioridad: "media",
    responsable: "Martin",
    observaciones: "Listo para coordinacion de entrega.",
    descuentoSolicitado: 10,
    plazoSolicitadoDias: 30,
    ultimaRespuestaHoras: 2,
  },
  {
    id: "ped_005",
    clienteId: "cli_005",
    bultos: 8,
    fecha: "2026-05-03",
    estado: "Armado",
    prioridad: "baja",
    responsable: "Sofia",
    observaciones: "Pedido chico dentro de condiciones.",
    descuentoSolicitado: 3,
    plazoSolicitadoDias: 7,
    ultimaRespuestaHoras: 1,
  },
  {
    id: "ped_006",
    clienteId: "cli_001",
    bultos: 16,
    fecha: "2026-05-02",
    estado: "Negociacion",
    prioridad: "media",
    responsable: "Eli",
    observaciones: "Esperando respuesta del cliente.",
    descuentoSolicitado: 9,
    plazoSolicitadoDias: 30,
    ultimaRespuestaHoras: 31,
  },
  {
    id: "ped_007",
    clienteId: "cli_004",
    bultos: 25,
    fecha: "2026-05-01",
    estado: "Entregado",
    prioridad: "baja",
    responsable: "Martin",
    observaciones: "Entrega cerrada.",
    descuentoSolicitado: 8,
    plazoSolicitadoDias: 30,
    ultimaRespuestaHoras: 0,
  },
  {
    id: "ped_008",
    clienteId: "cli_002",
    bultos: 11,
    fecha: "2026-05-01",
    estado: "Entregado",
    prioridad: "baja",
    responsable: "Sofia",
    observaciones: "Pedido entregado sin novedades.",
    descuentoSolicitado: 5,
    plazoSolicitadoDias: 14,
    ultimaRespuestaHoras: 0,
  },
]
```

- [x] **Step 3: Add mock negociaciones**

Create `src/data/mock-negociaciones.ts`:

```ts
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
```

- [x] **Step 4: Add mock historial**

Create `src/data/mock-historial.ts`:

```ts
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
```

- [x] **Step 5: Add data entrypoint**

Create `src/data/mock-index.ts`:

```ts
import type { AyroDataset } from "@/domain/types"

import { clientes } from "./mock-clientes"
import { historial } from "./mock-historial"
import { negociaciones } from "./mock-negociaciones"
import { pedidos } from "./mock-pedidos"

export const ayroDataset: AyroDataset = {
  clientes,
  pedidos,
  negociaciones,
  historial,
}
```

- [x] **Step 6: Verify mock data compiles**

Run:

```bash
npm run build
```

Expected: build passes with no TypeScript errors.

- [x] **Step 7: Commit**

```bash
git add src/data src/domain/types.ts
git commit -m "feat: add AYRO NEXO mock dataset"
```

---

### Task 3: Local Business Rules

**Files:**
- Create: `src/domain/rules.ts`

- [x] **Step 1: Add local rules**

Create `src/domain/rules.ts`:

```ts
import type {
  AccionOperativa,
  AlertaOperativa,
  Cliente,
  EvaluacionPedido,
  EventoHistorial,
  Negociacion,
  Pedido,
  PrioridadOperativa,
} from "@/domain/types"

const prioridadRank: Record<PrioridadOperativa, number> = {
  alta: 3,
  media: 2,
  baja: 1,
}

export function evaluarPedido(
  pedido: Pedido,
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
  negociaciones: Negociacion[]
): AlertaOperativa[] {
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

    if (pedido.ultimaRespuestaHoras > 24 && pedido.estado !== "Entregado") {
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
  negociaciones: Negociacion[]
): AccionOperativa[] {
  const alertas = generarAlertasOperativas(pedidos, clientes, negociaciones)
  const accionesDesdeAlertas = alertas.map<AccionOperativa>((alerta) => ({
    id: `accion_${alerta.id}`,
    titulo: alerta.titulo,
    detalle: alerta.detalle,
    prioridad: alerta.severidad === "critica" || alerta.severidad === "alta" ? "alta" : "media",
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
        titulo: `Aprobar negociacion de ${cliente?.nombre ?? "cliente sin identificar"}`,
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
```

- [x] **Step 2: Verify local rules compile**

Run:

```bash
npm run build
```

Expected: build passes with no TypeScript errors.

- [x] **Step 3: Commit**

```bash
git add src/domain/rules.ts
git commit -m "feat: add AYRO NEXO local business rules"
```

---

### Task 4: Dashboard Selectors

**Files:**
- Create: `src/domain/selectors.ts`

- [x] **Step 1: Add selectors**

Create `src/domain/selectors.ts`:

```ts
import type {
  AlertaOperativa,
  AyroDataset,
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

export function getMetricasOperativas(dataset: AyroDataset) {
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
    dataset.negociaciones
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

export function getDashboardData(dataset: AyroDataset) {
  const alertas = generarAlertasOperativas(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones
  )
  const colaAccion = construirColaAccion(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones
  )
  const historial = generarHistorialSimulado(dataset.historial, alertas)

  return {
    metricas: getMetricasOperativas(dataset),
    pedidosPorEstado: getPedidosPorEstado(dataset.pedidos),
    alertas,
    alertasPorSeveridad: getAlertasPorSeveridad(alertas),
    colaAccion,
    historialReciente: historial.slice(0, 5),
  }
}

export function getClienteNombre(dataset: AyroDataset, clienteId: string) {
  return (
    dataset.clientes.find((cliente) => cliente.id === clienteId)?.nombre ??
    "Cliente sin identificar"
  )
}

export function getHistorialReciente(historial: EventoHistorial[]) {
  return historial.slice(0, 5)
}
```

- [x] **Step 2: Verify selectors compile**

Run:

```bash
npm run build
```

Expected: build passes with no TypeScript errors.

- [x] **Step 3: Commit**

```bash
git add src/domain/selectors.ts
git commit -m "feat: add AYRO NEXO dashboard selectors"
```

---

### Task 5: Refactor Dashboard v2 UI

**Files:**
- Create: `src/domain/settings.ts`
- Create: `src/domain/ui-config.ts`
- Modify: `src/app/page.tsx`

- [x] **Step 1: Add configurable system settings**

Create `src/domain/settings.ts` with product and client-changeable settings. Keep labels, owners, thresholds, navigation, and module preview copy here.

```ts
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

export type MetricAccent = "cyan" | "amber" | "emerald" | "violet" | "slate" | "rose"

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
  ],
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
  ],
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
```

- [x] **Step 2: Add reusable UI config**

Create `src/domain/ui-config.ts` with shared visual mappings. Keep labels/classes here, not in `page.tsx`.

```ts
import type {
  PedidoEstado,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"
import { ayroSettings } from "@/domain/settings"

export const estadoPedidoConfig: Record<
  PedidoEstado,
  {
    label: string
    icon: "package" | "handshake" | "check" | "truck"
    className: string
    dotClassName: string
  }
> = {
  Armado: {
    ...ayroSettings.pedidoEstados.Armado,
    className: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    dotClassName: "bg-cyan-300",
  },
  Negociacion: {
    ...ayroSettings.pedidoEstados.Negociacion,
    className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    dotClassName: "bg-amber-300",
  },
  Confirmado: {
    ...ayroSettings.pedidoEstados.Confirmado,
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    dotClassName: "bg-emerald-300",
  },
  Entregado: {
    ...ayroSettings.pedidoEstados.Entregado,
    className: "border-slate-500/30 bg-slate-500/10 text-slate-200",
    dotClassName: "bg-slate-300",
  },
}

export const prioridadConfig: Record<
  PrioridadOperativa,
  {
    label: string
    className: string
  }
> = {
  alta: {
    ...ayroSettings.prioridades.alta,
    className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  },
  media: {
    ...ayroSettings.prioridades.media,
    className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  },
  baja: {
    ...ayroSettings.prioridades.baja,
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  },
}

export const severidadConfig: Record<
  SeveridadAlerta,
  {
    label: string
    className: string
  }
> = {
  critica: {
    ...ayroSettings.severidades.critica,
    className: "border-rose-400/35 bg-rose-400/10 text-rose-100",
  },
  alta: {
    ...ayroSettings.severidades.alta,
    className: "border-orange-400/35 bg-orange-400/10 text-orange-100",
  },
  media: {
    ...ayroSettings.severidades.media,
    className: "border-amber-400/35 bg-amber-400/10 text-amber-100",
  },
  baja: {
    ...ayroSettings.severidades.baja,
    className: "border-cyan-400/35 bg-cyan-400/10 text-cyan-100",
  },
}

export const metricAccentConfig = {
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  slate: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-200",
} as const
```

- [x] **Step 3: Replace inline data with derived dashboard data**

Modify `src/app/page.tsx` so it imports:

```ts
import { ayroDataset } from "@/data/mock-index"
import { ayroSettings } from "@/domain/settings"
import {
  estadoPedidoConfig,
  metricAccentConfig,
  prioridadConfig,
  severidadConfig,
} from "@/domain/ui-config"
import {
  getClienteNombre,
  getDashboardData,
} from "@/domain/selectors"
import type {
  AccionOperativa,
  AlertaOperativa,
  Pedido,
  PedidoEstado,
  PrioridadOperativa,
  SeveridadAlerta,
} from "@/domain/types"
```

Remove local `navigation`, `modulePreviews`, `OrderState`, `Order`, `alerts`, `orders`, inline metrics, and any hardcoded operational data that now lives in `src/data`, `src/domain/settings.ts`, or `src/domain`.

- [x] **Step 4: Add dashboard data constants near top-level**

Add after configuration constants:

```ts
const dashboardData = getDashboardData(ayroDataset)
```

Use `dashboardData.metricas`, `dashboardData.pedidosPorEstado`, `dashboardData.alertas`, `dashboardData.colaAccion`, and `dashboardData.historialReciente` in the page.

- [x] **Step 5: Update top metrics**

Render six metrics:

```tsx
<Metric title="Pedidos activos" value={String(dashboardData.metricas.pedidosActivos)} helper="Sin contar entregados" icon={Package} accent="cyan" />
<Metric title="En negociacion" value={String(dashboardData.metricas.pedidosEnNegociacion)} helper="Requieren decision" icon={Handshake} accent="amber" />
<Metric title="Confirmados" value={String(dashboardData.metricas.pedidosConfirmados)} helper="Listos para entrega" icon={CheckCircle2} accent="emerald" />
<Metric title="Entregados" value={String(dashboardData.metricas.pedidosEntregados)} helper="Operacion cerrada" icon={Truck} accent="slate" />
<Metric title="Clientes activos" value={String(dashboardData.metricas.clientesActivos)} helper="Con operacion vigente" icon={Users} accent="violet" />
<Metric title="Alertas abiertas" value={String(dashboardData.metricas.alertasAbiertas)} helper="Requieren accion" icon={ShieldAlert} accent="rose" />
```

Update `Metric` prop `accent` type to:

```ts
accent: "cyan" | "amber" | "emerald" | "violet" | "slate" | "rose"
```

Add matching accent classes.

- [x] **Step 6: Add Cola de Acción panel**

Place a new primary panel above or beside the kanban titled `Cola de accion`.

Render each `AccionOperativa` with:

```tsx
function ActionQueueItem({ action }: { action: AccionOperativa }) {
  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{action.titulo}</p>
          <p className="mt-1 text-sm leading-5 text-slate-400">{action.detalle}</p>
        </div>
        <PriorityBadge priority={action.prioridad} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Responsable: {action.responsable}</span>
        <span>Accion: {action.accionSugerida}</span>
      </div>
    </article>
  )
}
```

- [x] **Step 7: Update kanban cards**

Each kanban card must show:

- client name via `getClienteNombre(ayroDataset, pedido.clienteId)`
- bultos
- priority badge
- responsable
- warning/evaluation context from existing observations
- fecha

Use the existing dark command-center style and preserve responsive layout.

- [x] **Step 8: Update alert panel to use generated alerts**

Replace hardcoded alert list with `dashboardData.alertas`.

Use:

```tsx
function OperationalAlert({ alert }: { alert: AlertaOperativa }) {
  // render alert.titulo, alert.detalle, alert.severidad, alert.responsable, alert.accionSugerida
}
```

Use `severidadConfig` from `src/domain/ui-config.ts`; do not create inline severity class maps in `page.tsx`.

- [x] **Step 9: Update historial reciente**

Render `dashboardData.historialReciente` instead of hardcoded activity text.

Each row must show:

- `accion`
- `detalle`
- `responsable`
- `fecha`

- [x] **Step 10: Run verification**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

- [x] **Step 11: Commit**

```bash
git add src/app/page.tsx src/data src/domain
git commit -m "feat: build AYRO NEXO dashboard v2 data flow"
```

---

### Task 6: Visual QA and Blueprint Alignment

**Files:**
- Modify only if needed: `src/app/page.tsx`
- Keep: `BLUEPRINT.md`

- [ ] **Step 1: Start local dev server**

Run:

```bash
npm run dev -- --port 3000
```

Expected: app starts at `http://localhost:3000`.

- [ ] **Step 2: Validate MVP acceptance manually**

Open `http://localhost:3000` and confirm:

- dashboard shows active, negotiation, confirmed, delivered, clients, and open alerts metrics;
- Cola de Acción answers “que tengo que resolver ahora”;
- kanban has `Armado`, `Negociacion`, `Confirmado`, `Entregado`;
- each order card shows client, bultos, priority, responsible, warning/context, and date;
- alerts are generated from mock data/rules and show responsible/action;
- recent history is rendered from simulated history;
- no text overlaps on desktop width;
- mobile layout stacks without horizontal overflow.

- [ ] **Step 3: Re-run final checks**

Run:

```bash
npm run lint
npm run build
git diff --check
git status --short
```

Expected:

- lint passes;
- build passes;
- `git diff --check` has no output;
- only intended files are modified or untracked.

- [ ] **Step 4: Commit final visual fixes if any**

If visual fixes were needed:

```bash
git add src/app/page.tsx
git commit -m "fix: polish AYRO NEXO dashboard v2 layout"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review Checklist

- Blueprint v2 coverage:
  - Dashboard Operativo: Task 5.
  - Cola de Acción: Tasks 3 and 5.
  - Clientes/Pedidos/Negociaciones/Historial/Alertas as MVP data modules: Tasks 1-4.
  - Responsables and priorities: Tasks 1-5.
  - Local rules for approval and alerts: Task 3.
  - Frontend-only constraint: all tasks, no backend/db/auth/API work.
- Test/verification:
  - `npm run lint`.
  - `npm run build`.
  - local dev server visual QA.
  - `git diff --check`.
- Out of scope:
  - Prisma/PostgreSQL.
  - authentication.
  - external APIs.
  - backend endpoints.
  - persistence.
