# AYRO NEXO Sprint 2 v2.1 Local Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir AYRO NEXO de un dashboard decisional mock en una app frontend-first operable, navegable y validable, con vistas internas, flujo simulado de pedidos, reglas locales configurables, historial completo y preparación limpia para backend futuro.

**Architecture:** Mantener una sola app Next.js App Router con datos locales centralizados. Extraer shell, vistas y componentes compartidos para que `src/app/page.tsx` quede liviano. El estado de navegacion, configuracion y simulacion vive en memoria; no se agrega backend, DB, auth, Prisma, APIs ni persistencia.

**Data Source Boundary:** Sprint 2 debe aislar los mocks detras de `src/data/source.ts`. Las vistas reciben `AyroDataset` por props y no importan `src/data/mock-index.ts`; cuando el MVP pase a datos reales, el cambio debe concentrarse en el adapter/fuente de datos.

**Tech Stack:** Next.js App Router 16.2.4, React 19.2.4, TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react.

---

## 0. Principio Rector

Este sprint NO busca agregar backend.

Busca validar si AYRO NEXO funciona como sistema operativo comercial antes de persistir datos.

**Regla madre:**

```txt
Primero operación simulada correcta.
Después backend.
```

---

## 1. Alcance del Sprint 2 Corregido

### Incluye

- Sidebar con navegación interna.
- Shell principal de aplicación.
- Dashboard v2 extraído a feature propia.
- Vistas operables:
  - Dashboard
  - Clientes
  - Pedidos
  - Negociaciones
  - Condiciones Comerciales
  - Historial
  - Configuraciones
- Estado local en memoria.
- Simulación de creación/evaluación de pedido.
- Reglas locales configurables.
- Cola de Acción conectada a reglas.
- Historial completo operativo.
- Componentes compartidos para badges, estados, severidades, prioridades y rows.
- Preparación clara para backend futuro.

### No incluye

- Backend.
- Base de datos.
- Prisma.
- PostgreSQL.
- Autenticación.
- APIs externas.
- Persistencia real.
- Roles/permisos avanzados.
- Automatizaciones.
- Notificaciones reales.

---

## 2. Arquitectura Recomendada

```txt
src/
├── app/
│   └── page.tsx
│
├── components/
│   └── ayro/
│       ├── ayro-shell.tsx
│       ├── icon-map.ts
│       └── shared.tsx
│
├── data/
│   ├── mock-clientes.ts
│   ├── mock-pedidos.ts
│   ├── mock-negociaciones.ts
│   ├── mock-historial.ts
│   ├── mock-index.ts
│   └── source.ts
│
├── domain/
│   ├── types.ts
│   ├── settings.ts
│   ├── ui-config.ts
│   ├── rules.ts
│   └── selectors.ts
│
└── features/
    ├── dashboard/
    │   └── dashboard-view.tsx
    ├── clientes/
    │   └── clientes-view.tsx
    ├── pedidos/
    │   └── pedidos-view.tsx
    ├── negociaciones/
    │   └── negociaciones-view.tsx
    ├── condiciones/
    │   └── condiciones-view.tsx
    ├── historial/
    │   └── historial-view.tsx
    └── configuraciones/
        └── configuraciones-view.tsx
```

---

## 2.1. Data Source Boundary

El Sprint 2 debe preparar el paso a MVP real sin obligar a reescribir vistas.

Regla:

```txt
Las vistas no saben si los datos vienen de mocks, API, backend o DB.
Solo reciben un AyroDataset por props.
```

Implementacion inmediata:

```ts
// src/data/source.ts
import type { AyroDataset } from "@/domain/types"

import { ayroDataset } from "./mock-index"

export function getAyroDataset(): AyroDataset {
  return ayroDataset
}
```

Uso esperado desde `src/app/page.tsx`:

```tsx
const dataset = getAyroDataset()

<DashboardView dataset={dataset} config={config} />
<ClientesView dataset={dataset} />
<PedidosView dataset={dataset} config={config} />
<NegociacionesView dataset={dataset} />
<CondicionesView dataset={dataset} />
<HistorialView dataset={dataset} config={config} />
```

Prohibido dentro de `src/features`:

```ts
import { ayroDataset } from "@/data/mock-index"
```

Cuando exista backend, la migracion debe concentrarse en `src/data/source.ts` o en un adapter equivalente, no en todas las vistas.

---

## 3. Correcciones Principales Sobre el Plan Original

### Corrección 1: Pedidos no debe ser solo listado

El plan original proponía filtros y preview de pedido nuevo. Eso es correcto, pero insuficiente.

**Cambio obligatorio:**

La vista Pedidos debe permitir simular un pedido nuevo en memoria.

Flujo mínimo:

```txt
Seleccionar cliente
Ingresar bultos
Ingresar descuento solicitado
Ingresar plazo solicitado
Seleccionar responsable
Seleccionar prioridad
Click en "Simular evaluación"
Resultado:
  - Confirmado
  - Negociación
  - Bloqueado
  - Alerta sugerida
```

Esto valida el corazón del negocio sin backend.

---

### Corrección 2: Configuraciones debe impactar las reglas

El plan original permitía alternar el umbral de pedido sin respuesta 24h/48h, pero podía quedar visual.

**Cambio obligatorio:**

El umbral configurado en memoria debe entrar en `generarAlertasOperativas`.

Ejemplo:

```ts
generarAlertasOperativas(pedidos, clientes, negociaciones, configLocal)
```

Si el usuario cambia de 24h a 48h, las alertas del dashboard deben recalcularse localmente.

---

### Corrección 3: Historial debe mostrar historial completo

El dashboard puede mostrar 5 eventos.

La vista Historial debe mostrar todo el historial operativo simulado.

**Cambio obligatorio:**

Crear selector:

```ts
export function getHistorialOperativo(dataset: AyroDataset, config?: ConfiguracionLocal) {
  const alertas = generarAlertasOperativas(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  )

  return generarHistorialSimulado(dataset.historial, alertas)
}
```

---

### Corrección 4: Agregar detalle básico expandible

No hace falta detalle profundo, pero sí debe existir una primera capa.

**Cambio recomendado:**

Cada vista de entidad debe permitir ver más detalle sin navegar a rutas nuevas.

Opciones válidas:

- Card expandible.
- Panel lateral.
- Modal simple.
- Sección "Ver detalle".

Prioridad mínima:

- Cliente: condiciones, pedidos activos, responsable.
- Pedido: evaluación comercial, observaciones, estado, historial relacionado.
- Negociación: motivo, responsable de aprobación, pedido asociado.

---

## 4. Tipos Nuevos o Modificados

### `src/domain/types.ts`

Agregar:

```ts
export type AyroViewId =
  | "dashboard"
  | "clientes"
  | "pedidos"
  | "negociaciones"
  | "condiciones"
  | "historial"
  | "configuraciones"

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
```

---

## 5. Settings Centralizados

### `src/domain/settings.ts`

Debe contener:

```ts
navigation: [
  { id: "dashboard", label: "Dashboard", icon: "layout" },
  { id: "clientes", label: "Clientes", icon: "building" },
  { id: "pedidos", label: "Pedidos", icon: "clipboard" },
  { id: "negociaciones", label: "Negociaciones", icon: "handshake" },
  { id: "condiciones", label: "Condiciones", icon: "sliders" },
  { id: "historial", label: "Historial", icon: "history" },
  { id: "configuraciones", label: "Configuraciones", icon: "settings" },
]
```

También debe contener:

```ts
operational: {
  responsables: ["Eli", "Sofia", "Martin"],
  pedidoSinRespuestaHoras: 24,
}
```

Y textos de vistas:

```ts
views: {
  dashboard: {
    title: "Operacion AYRO en vivo",
    description: "Pedidos, negociaciones, condiciones y alertas en una sola vista operativa.",
  },
  clientes: {
    title: "Clientes",
    description: "Estado comercial, responsable y condiciones operativas por cliente.",
  },
  pedidos: {
    title: "Pedidos",
    description: "Carga simulada, seguimiento y evaluación comercial de pedidos.",
  },
  negociaciones: {
    title: "Negociaciones",
    description: "Excepciones comerciales, aprobaciones y bloqueos activos.",
  },
  condiciones: {
    title: "Condiciones Comerciales",
    description: "Límites comerciales por cliente y brechas que requieren carga.",
  },
  historial: {
    title: "Historial",
    description: "Línea de tiempo completa de eventos comerciales y operativos.",
  },
  configuraciones: {
    title: "Configuraciones",
    description: "Valores ajustables del sistema para evitar cambios chicos en código.",
  },
}
```

---

## 6. Rules Corregidas

### `src/domain/rules.ts`

La función de alertas debe aceptar configuración local opcional:

```ts
export function generarAlertasOperativas(
  pedidos: Pedido[],
  clientes: Cliente[],
  negociaciones: Negociacion[],
  config?: Pick<ConfiguracionLocal, "pedidoSinRespuestaHoras">
): AlertaOperativa[] {
  const umbralSinRespuesta = config?.pedidoSinRespuestaHoras ?? 24

  // Usar umbralSinRespuesta en vez de 24 hardcodeado.
}
```

Tambien deben aceptar el mismo `config`:

```ts
construirColaAccion(pedidos, clientes, negociaciones, config)
getMetricasOperativas(dataset, config)
getDashboardData(dataset, config)
getHistorialOperativo(dataset, config)
```

### Evaluación de pedido

Mantener:

```ts
export function evaluarPedido(
  pedido: Pedido | PedidoDraft,
  cliente: Cliente | undefined
): EvaluacionPedido
```

Debe soportar tanto pedidos existentes como drafts simulados.

---

## 7. Selectors Corregidos

### `src/domain/selectors.ts`

Agregar:

```ts
export function getDashboardData(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  const alertas = generarAlertasOperativas(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  )

  const colaAccion = construirColaAccion(
    dataset.pedidos,
    dataset.clientes,
    dataset.negociaciones,
    config
  )

  const historial = generarHistorialSimulado(dataset.historial, alertas)

  return {
    metricas: getMetricasOperativas(dataset, config),
    pedidosPorEstado: getPedidosPorEstado(dataset.pedidos),
    alertas,
    alertasPorSeveridad: getAlertasPorSeveridad(alertas),
    colaAccion,
    historialReciente: historial.slice(0, 5),
    historialCompleto: historial,
  }
}
```

Agregar:

```ts
export function getHistorialOperativo(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  return getDashboardData(dataset, config).historialCompleto
}
```

Agregar resumen para pedidos:

```ts
export function getPedidoDetalle(dataset: AyroDataset, pedidoId: string) {
  const pedido = dataset.pedidos.find((item) => item.id === pedidoId)
  const cliente = pedido
    ? dataset.clientes.find((item) => item.id === pedido.clienteId)
    : undefined

  const negociacion = dataset.negociaciones.find(
    (item) => item.pedidoId === pedidoId
  )

  const historial = dataset.historial.filter(
    (event) => event.entidadId === pedidoId || event.entidadId === negociacion?.id
  )

  return {
    pedido,
    cliente,
    negociacion,
    historial,
  }
}
```

---

## 8. App State Central

### `src/app/page.tsx`

Debe tener estado local compartido:

```tsx
"use client"

import { useMemo, useState } from "react"

import { AyroShell } from "@/components/ayro/ayro-shell"
import { getAyroDataset } from "@/data/source"
import { ayroSettings } from "@/domain/settings"
import type { AyroViewId, ConfiguracionLocal } from "@/domain/types"
import { DashboardView } from "@/features/dashboard/dashboard-view"
import { ClientesView } from "@/features/clientes/clientes-view"
import { PedidosView } from "@/features/pedidos/pedidos-view"
import { NegociacionesView } from "@/features/negociaciones/negociaciones-view"
import { CondicionesView } from "@/features/condiciones/condiciones-view"
import { HistorialView } from "@/features/historial/historial-view"
import { ConfiguracionesView } from "@/features/configuraciones/configuraciones-view"

const initialConfig: ConfiguracionLocal = {
  responsables: ayroSettings.operational.responsables,
  pedidoSinRespuestaHoras: ayroSettings.operational.pedidoSinRespuestaHoras,
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

export default function Home() {
  const [activeView, setActiveView] = useState<AyroViewId>("dashboard")
  const [config, setConfig] = useState<ConfiguracionLocal>(initialConfig)
  const dataset = useMemo(() => getAyroDataset(), [])

  const activePackages = useMemo(
    () =>
      dataset.pedidos
        .filter((pedido) => pedido.estado !== "Entregado")
        .reduce((acc, pedido) => acc + pedido.bultos, 0),
    [dataset]
  )

  const renderView = () => {
    switch (activeView) {
      case "clientes":
        return <ClientesView dataset={dataset} />
      case "pedidos":
        return <PedidosView dataset={dataset} config={config} />
      case "negociaciones":
        return <NegociacionesView dataset={dataset} />
      case "condiciones":
        return <CondicionesView dataset={dataset} />
      case "historial":
        return <HistorialView dataset={dataset} config={config} />
      case "configuraciones":
        return <ConfiguracionesView config={config} onConfigChange={setConfig} />
      case "dashboard":
      default:
        return <DashboardView dataset={dataset} config={config} />
    }
  }

  return (
    <AyroShell
      activeView={activeView}
      activePackages={activePackages}
      onNavigate={setActiveView}
    >
      {renderView()}
    </AyroShell>
  )
}
```

---

## 9. Vista Pedidos Corregida

### Objetivo

La vista Pedidos debe dejar de ser solo lectura.

Debe validar el flujo real:

```txt
Pedido nuevo → Evaluación local → Resultado operativo
```

### Debe incluir

- Filtros por estado.
- Listado de pedidos existentes.
- Formulario local de simulación.
- Resultado de evaluación.
- Alerta preview si corresponde.
- No persistir pedido real todavía.
- Mensaje claro: "Simulación en memoria, no guarda datos."

### Formulario mínimo

Campos:

- Cliente.
- Bultos.
- Fecha.
- Responsable.
- Prioridad.
- Descuento solicitado.
- Plazo solicitado.
- Observaciones.

### Resultado esperado

Si el cliente no tiene condiciones:

```txt
Estado sugerido: Negociación
Motivo: Cliente sin condiciones comerciales
Acción sugerida: Cargar condiciones comerciales
```

Si supera descuento:

```txt
Estado sugerido: Negociación
Motivo: Descuento solicitado supera el límite permitido
Acción sugerida: Revisar excepción comercial
```

Si cumple:

```txt
Estado sugerido: Confirmado
Motivo: Pedido dentro de condiciones comerciales
Acción sugerida: Avanzar a confirmación
```

---

## 10. Vista Configuraciones Corregida

### Objetivo

Debe mostrar valores ajustables y afectar el dashboard localmente.

### Debe incluir

- Responsables disponibles.
- Umbral pedido sin respuesta.
- Labels de estados.
- Labels de prioridades.
- Labels de severidades.
- Aviso claro de no persistencia.
- Control real para alternar 24h/48h.
- Al cambiar el umbral, Dashboard e Historial deben recalcular alertas.

### Regla

No puede ser una maqueta muerta.

Debe tener efecto visible.

---

## 11. Vista Historial Corregida

### Objetivo

Mostrar historial completo operativo.

No usar solo `historialReciente`.

### Debe incluir

- Eventos base mock.
- Eventos generados por alertas.
- Responsable.
- Fecha.
- Entidad.
- Detalle.
- Filtro opcional por entidad.

Filtro opcional recomendado:

```txt
Todos / Cliente / Pedido / Negociación / Alerta
```

---

## 12. Vista Clientes Corregida

### Debe mostrar

- Nombre.
- Estado.
- Responsable.
- Datos operativos.
- Pedidos activos.
- Bultos activos.
- Condiciones completas/incompletas.
- Botón o sección "Ver detalle".

### Detalle mínimo

- Descuento permitido.
- Plazo permitido.
- Pedidos asociados.
- Estado operativo sugerido:

```txt
Listo para operar
Requiere condiciones
Observado
```

---

## 13. Vista Negociaciones Corregida

### Debe mostrar

- Cliente.
- Pedido asociado.
- Motivo.
- Estado.
- Responsable aprobación.
- Aprobación requerida.
- Comentario si existe.
- Acción sugerida.

### Mejora recomendada

Agrupar por estado:

```txt
Pendientes
Bloqueadas
Aprobadas
Rechazadas
```

---

## 14. Vista Condiciones Corregida

### Debe mostrar

- Cliente.
- Descuento permitido.
- Plazo permitido.
- Responsable.
- Estado de condición:
  - Completa.
  - Incompleta.
- Impacto:
  - "Puede evaluarse automáticamente."
  - "Genera alerta hasta cargar condiciones."

### Mejora recomendada

Mostrar arriba un resumen:

```txt
Clientes con condiciones completas
Clientes incompletos
Porcentaje de cobertura comercial
```

---

## 15. Shell y Navegación

### `src/components/ayro/ayro-shell.tsx`

Debe:

- Tener sidebar.
- Mostrar vista activa.
- Usar `id` de navegación, no label.
- Mostrar header por vista desde `ayroSettings.views`.
- Mantener estilo sistema, no landing.
- Tener layout responsive.

---

## 16. Orden Correcto de Implementación

### Task 1: Data source, tipos y settings

- [x] Crear `src/data/source.ts`.
- [x] Agregar `AyroViewId`.
- [x] Agregar `ConfiguracionLocal`.
- [x] Agregar `PedidoDraft`.
- [x] Agregar `ResultadoSimulacionPedido`.
- [x] Centralizar navegación y labels.

Resultado: completado en commit `3a1765a`.

### Task 2: UI compartida

- [x] Crear `icon-map.ts`.
- [x] Crear `shared.tsx`.
- [x] Crear `ayro-shell.tsx`.

Resultado: completado en commit `0d9b547`.

### Task 3: Extraer dashboard

- [x] Mover dashboard a `features/dashboard/dashboard-view.tsx`.
- [x] `page.tsx` queda liviano.
- [x] Dashboard recibe `config`.

Resultado: completado en commit `634214f`.

### Task 4: Reglas configurables

- [x] `generarAlertasOperativas` usa `pedidoSinRespuestaHoras`.
- [x] `getDashboardData` recibe config.
- [x] Alertas cambian al cambiar configuración.

Resultado: completado en commit `9ad9f03`.

### Task 5: Configuración local global

- [x] Crear `initialConfig`.
- [x] Pasar `config` a Dashboard y preparar propagacion a vistas.
- [x] `ConfiguracionesView` modifica `config`.

Resultado: completado en commit `264a30f`.

### Task 6: Clientes View

- [x] Cards por cliente.
- [x] Detalle mínimo.
- [x] Condición completa/incompleta.

Resultado: completado en commit `d54922e`.

### Task 7: Pedidos View

- [x] Filtros.
- [x] Listado.
- [x] Formulario de simulación.
- [x] Evaluación local.
- [x] Resultado visible.

Resultado: completado en commit `d54922e`.

### Task 8: Negociaciones View

- Listado agrupado por estado.
- Acción sugerida.

### Task 9: Condiciones View

- Cards por cliente.
- Resumen de cobertura comercial.

### Task 10: Historial View

- Historial completo.
- Filtro opcional por entidad.

### Task 11: QA y README

- `npm run lint`
- `npm run build`
- `git diff --check`
- prueba visual desktop/mobile.
- actualizar README.

---

## 17. Criterios de Aceptación Corregidos

El sprint se considera completo si:

- Sidebar navega entre todas las vistas.
- `src/app/page.tsx` queda liviano.
- Dashboard sigue funcionando.
- Clientes muestra clientes reales mock y condiciones.
- Pedidos permite simular un pedido nuevo.
- La simulación devuelve evaluación clara.
- Negociaciones muestra excepciones activas.
- Condiciones muestra cobertura comercial.
- Historial muestra historial completo, no solo 5 eventos.
- Configuraciones cambia el umbral 24h/48h.
- Cambiar configuración modifica alertas visibles.
- No se agrega backend, DB, auth, Prisma, APIs ni persistencia.
- No hay datos operativos hardcodeados dentro de componentes.
- `npm run lint` pasa.
- `npm run build` pasa.
- No hay overflow en mobile.
- La app se siente como sistema, no como landing page.

---

## 18. Riesgos a Controlar

### Riesgo 1: Configuraciones decorativa

Si Configuraciones no afecta reglas, confunde.

**Solución:** conectar umbral a alertas.

### Riesgo 2: Pedido simulado que no usa reglas reales

Si el formulario calcula por su cuenta, duplica lógica.

**Solución:** usar `evaluarPedido`.

### Riesgo 3: Vista Historial demasiado chica

Si usa `historialReciente`, no cumple.

**Solución:** usar `historialCompleto`.

### Riesgo 4: page.tsx vuelve a crecer

Si se meten vistas inline en page, se pierde arquitectura.

**Solución:** cada vista en `features`.

### Riesgo 5: Settings hardcodeados en componentes

Si se repiten labels/colores, después cuesta modificar.

**Solución:** usar `settings.ts` y `ui-config.ts`.

---

## 19. Cierre Estratégico

Este Sprint 2 corregido convierte AYRO NEXO en:

```txt
Un sistema frontend-first navegable,
con operación simulada,
reglas locales,
configuración viva,
historial completo
y estructura lista para backend.
```

No es el backend todavía.

Es la prueba operacional previa al backend.

Si este sprint queda bien, el Sprint 3 puede ser:

```txt
Persistencia local / Backend mínimo / API real
```

pero con menos riesgo, porque el flujo ya habrá sido probado.

---

## 20. Plan Ejecutable Task-by-Task

### Task 1: Data Source Boundary, Tipos, Settings y Contratos Configurables

**Files:**
- Create: `src/data/source.ts`
- Modify: `src/domain/types.ts`
- Modify: `src/domain/settings.ts`

- [x] **Step 1: Crear frontera unica de datos**

Crear `src/data/source.ts`:

```ts
import type { AyroDataset } from "@/domain/types"

import { ayroDataset } from "./mock-index"

export function getAyroDataset(): AyroDataset {
  return ayroDataset
}
```

Regla para el resto del sprint:

```txt
Features y vistas importan el dataset desde props.
Solo page.tsx puede llamar getAyroDataset().
Ninguna feature importa mock-index.ts.
```

- [x] **Step 2: Agregar tipos de navegacion y configuracion**

Agregar en `src/domain/types.ts`:

```ts
export type AyroViewId =
  | "dashboard"
  | "clientes"
  | "pedidos"
  | "negociaciones"
  | "condiciones"
  | "historial"
  | "configuraciones"

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
```

- [x] **Step 3: Convertir navegacion a ids estables**

En `src/domain/settings.ts`, importar `AyroViewId` y cambiar `NavigationItem`:

```ts
type NavigationItem = {
  id: AyroViewId
  label: string
  icon: AyroIconKey
}
```

Actualizar `navigation`:

```ts
navigation: [
  { id: "dashboard", label: "Dashboard", icon: "layout" },
  { id: "clientes", label: "Clientes", icon: "building" },
  { id: "pedidos", label: "Pedidos", icon: "clipboard" },
  { id: "negociaciones", label: "Negociaciones", icon: "handshake" },
  { id: "condiciones", label: "Condiciones", icon: "sliders" },
  { id: "historial", label: "Historial", icon: "history" },
  { id: "configuraciones", label: "Configuraciones", icon: "settings" },
] satisfies NavigationItem[],
```

- [x] **Step 4: Agregar labels de vistas y configuracion local**

Agregar en `ayroSettings`:

```ts
views: {
  dashboard: {
    title: "Operacion AYRO en vivo",
    description: "Pedidos, negociaciones, condiciones y alertas en una sola vista operativa.",
  },
  clientes: {
    title: "Clientes",
    description: "Estado comercial, responsable y condiciones operativas por cliente.",
  },
  pedidos: {
    title: "Pedidos",
    description: "Carga simulada, seguimiento y evaluacion comercial de pedidos.",
  },
  negociaciones: {
    title: "Negociaciones",
    description: "Excepciones comerciales, aprobaciones y bloqueos activos.",
  },
  condiciones: {
    title: "Condiciones Comerciales",
    description: "Limites comerciales por cliente y brechas que requieren carga.",
  },
  historial: {
    title: "Historial",
    description: "Linea de tiempo completa de eventos comerciales y operativos.",
  },
  configuraciones: {
    title: "Configuraciones",
    description: "Valores ajustables del sistema para evitar cambios chicos en codigo.",
  },
},
configuracionLocal: {
  title: "Configuracion local simulada",
  description: "Estos valores todavia no persisten. Preparan el modelo configurable del sistema.",
  noPersistenceLabel: "Sin persistencia",
  thresholdToggleLabel: "Alternar umbral 24h/48h",
},
```

- [x] **Step 5: Verificar y commitear**

```bash
npm run build
git add src/data/source.ts src/domain/types.ts src/domain/settings.ts
git commit -m "feat: add AYRO NEXO sprint 2 domain settings"
```

Expected: build sin errores TypeScript y commit creado.

---

### Task 2: Shell, Icon Map y UI Compartida

**Files:**
- Create: `src/components/ayro/icon-map.ts`
- Create: `src/components/ayro/shared.tsx`
- Create: `src/components/ayro/ayro-shell.tsx`

- [x] **Step 1: Crear icon map central**

Crear `src/components/ayro/icon-map.ts` con `iconMap` y `BrandIcon`, moviendo el mapping actual de `src/app/page.tsx`.

- [x] **Step 2: Crear badges y rows compartidos**

Crear `src/components/ayro/shared.tsx` con:

```tsx
StateBadge
PriorityBadge
SeverityBadge
KeyValueRow
```

Los badges deben usar `estadoPedidoConfig`, `prioridadConfig` y `severidadConfig`.

- [x] **Step 3: Crear shell navegable**

Crear `src/components/ayro/ayro-shell.tsx` como client component con props:

```ts
{
  activeView: AyroViewId
  activePackages: number
  children: ReactNode
  onNavigate: (view: AyroViewId) => void
}
```

Debe renderizar sidebar, header por `ayroSettings.views[activeView]`, pulso operativo y contenido.

- [x] **Step 4: Verificar y commitear**

```bash
npm run build
git add src/components/ayro
git commit -m "feat: add AYRO NEXO shell components"
```

Expected: build sin errores.

---

### Task 3: Extraer Dashboard y Aligerar Page

**Files:**
- Create: `src/features/dashboard/dashboard-view.tsx`
- Modify: `src/app/page.tsx`

- [x] **Step 1: Mover dashboard a feature**

Crear `src/features/dashboard/dashboard-view.tsx` con:

```ts
export function DashboardView({
  dataset,
  config,
}: {
  dataset: AyroDataset
  config: ConfiguracionLocal
}) {
  const dashboardData = getDashboardData(dataset, config)
  // Render actual del dashboard.
}
```

Mantener en este archivo las subpiezas propias del dashboard:

```txt
Metric
ActionQueueItem
KanbanColumn
OrderCard
OperationalAlert
ModulePreview
```

- [x] **Step 2: Convertir page en entrypoint de estado**

Modificar `src/app/page.tsx` con:

```tsx
"use client"

import { useMemo, useState } from "react"

import { AyroShell } from "@/components/ayro/ayro-shell"
import { getAyroDataset } from "@/data/source"
import { ayroSettings } from "@/domain/settings"
import type { AyroViewId, ConfiguracionLocal } from "@/domain/types"
import { DashboardView } from "@/features/dashboard/dashboard-view"

const initialConfig: ConfiguracionLocal = {
  responsables: ayroSettings.operational.responsables,
  pedidoSinRespuestaHoras: ayroSettings.operational.pedidoSinRespuestaHoras,
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

export default function Home() {
  const [activeView, setActiveView] = useState<AyroViewId>("dashboard")
  const [config] = useState<ConfiguracionLocal>(initialConfig)
  const dataset = useMemo(() => getAyroDataset(), [])

  const activePackages = useMemo(
    () =>
      dataset.pedidos
        .filter((pedido) => pedido.estado !== "Entregado")
        .reduce((acc, pedido) => acc + pedido.bultos, 0),
    [dataset]
  )

  return (
    <AyroShell
      activeView={activeView}
      activePackages={activePackages}
      onNavigate={setActiveView}
    >
      <DashboardView dataset={dataset} config={config} />
    </AyroShell>
  )
}
```

- [x] **Step 3: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/app/page.tsx src/features/dashboard/dashboard-view.tsx
git commit -m "refactor: extract AYRO NEXO dashboard view"
```

Expected: dashboard sigue igual visualmente, checks pasan y `src/features/dashboard/dashboard-view.tsx` no importa `@/data/mock-index`.

---

### Task 4: Reglas y Selectors Configurables

**Files:**
- Modify: `src/domain/rules.ts`
- Modify: `src/domain/selectors.ts`

- [x] **Step 1: Hacer configurable el umbral sin respuesta**

Modificar `generarAlertasOperativas`:

```ts
export function generarAlertasOperativas(
  pedidos: Pedido[],
  clientes: Cliente[],
  negociaciones: Negociacion[],
  config?: Pick<ConfiguracionLocal, "pedidoSinRespuestaHoras">
): AlertaOperativa[] {
  const umbralSinRespuesta = config?.pedidoSinRespuestaHoras ?? 24
  // reemplazar comparaciones contra 24 por umbralSinRespuesta
}
```

- [x] **Step 2: Pasar config por cola, metricas y dashboard data**

Actualizar firmas:

```ts
construirColaAccion(pedidos, clientes, negociaciones, config?)
getMetricasOperativas(dataset, config?)
getDashboardData(dataset, config?)
getHistorialOperativo(dataset, config?)
```

- [x] **Step 3: Agregar historial completo**

Agregar en `src/domain/selectors.ts`:

```ts
export function getHistorialOperativo(
  dataset: AyroDataset,
  config?: ConfiguracionLocal
) {
  return getDashboardData(dataset, config).historialCompleto
}
```

`getDashboardData` debe devolver `historialCompleto`.

- [x] **Step 4: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/domain/rules.ts src/domain/selectors.ts
git commit -m "feat: make AYRO NEXO rules configurable"
```

Expected: dashboard compila y sigue usando reglas centralizadas.

---

### Task 5: Configuracion Local Global y Vista Configuraciones

**Files:**
- Create: `src/features/configuraciones/configuraciones-view.tsx`
- Modify: `src/app/page.tsx`

- [x] **Step 1: Crear vista Configuraciones**

Crear `ConfiguracionesView` con props:

```ts
{
  config: ConfiguracionLocal
  onConfigChange: Dispatch<SetStateAction<ConfiguracionLocal>>
}
```

Debe mostrar responsables, umbral sin respuesta, labels de estados, prioridades, severidades y aviso `Sin persistencia`.

- [x] **Step 2: Agregar control vivo 24h/48h**

El boton debe ejecutar:

```ts
onConfigChange((current) => ({
  ...current,
  pedidoSinRespuestaHoras:
    current.pedidoSinRespuestaHoras === 24 ? 48 : 24,
}))
```

- [x] **Step 3: Pasar setConfig desde page**

En `src/app/page.tsx`, cambiar:

```ts
const [config] = useState<ConfiguracionLocal>(initialConfig)
```

por:

```ts
const [config, setConfig] = useState<ConfiguracionLocal>(initialConfig)
```

Agregar `renderView()` con caso `configuraciones`.

- [x] **Step 4: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/features/configuraciones src/app/page.tsx
git commit -m "feat: add AYRO NEXO live settings view"
```

Expected: Configuraciones alterna el umbral en memoria.

---

### Task 6: Clientes View

**Files:**
- Create: `src/features/clientes/clientes-view.tsx`
- Modify: `src/domain/selectors.ts`
- Modify: `src/app/page.tsx`

- [x] **Step 1: Agregar selector de clientes**

Agregar `getClientesResumen(dataset)` con pedidos activos, bultos activos y condicion completa/incompleta.

- [x] **Step 2: Crear vista Clientes**

Debe mostrar nombre, estado, responsable, datos operativos, pedidos activos, bultos activos, condiciones y bloque "Ver detalle" expandible o visible.

- [x] **Step 3: Conectar navegación**

Agregar caso `clientes` en `renderView()`.
Pasar `dataset` por props. No importar `mock-index.ts` desde la vista.

- [x] **Step 4: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/domain/selectors.ts src/features/clientes src/app/page.tsx
git commit -m "feat: add AYRO NEXO clientes workflow view"
```

Expected: Clientes muestra datos mock reales y condiciones incompletas.

---

### Task 7: Pedidos View con Simulacion

**Files:**
- Create: `src/features/pedidos/pedidos-view.tsx`
- Modify: `src/app/page.tsx`

- [x] **Step 1: Crear formulario local de simulacion**

Campos obligatorios:

```txt
clienteId
bultos
fecha
responsable
prioridad
descuentoSolicitado
plazoSolicitadoDias
observaciones
```

- [x] **Step 2: Evaluar draft con regla real**

Construir `PedidoDraft`, buscar cliente y usar:

```ts
const evaluacion = evaluarPedido(draft, cliente)
```

Mostrar estado sugerido, motivo y accion sugerida.

- [x] **Step 3: Agregar filtros/listado**

Mantener filtros por:

```txt
Todos / Armado / Negociacion / Confirmado / Entregado
```

- [x] **Step 4: Conectar navegación**

Agregar caso `pedidos` en `renderView()` y pasar `config`.
Pasar `dataset` por props. No importar `mock-index.ts` desde la vista.

- [x] **Step 5: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/features/pedidos src/app/page.tsx
git commit -m "feat: add AYRO NEXO pedido simulation view"
```

Expected: la simulacion devuelve Confirmado o Negociacion usando `evaluarPedido`.

---

### Task 8: Negociaciones View

**Files:**
- Create: `src/features/negociaciones/negociaciones-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear vista agrupada**

Agrupar negociaciones por:

```txt
pendiente
bloqueada
aprobada
rechazada
```

Cada card debe mostrar cliente, pedido, motivo, estado, responsable aprobacion, aprobacion requerida, comentario y accion sugerida.

- [ ] **Step 2: Conectar navegación**

Agregar caso `negociaciones` en `renderView()`.
Pasar `dataset` por props. No importar `mock-index.ts` desde la vista.

- [ ] **Step 3: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/features/negociaciones src/app/page.tsx
git commit -m "feat: add AYRO NEXO negociaciones workflow view"
```

Expected: pendientes y bloqueadas visibles.

---

### Task 9: Condiciones Comerciales View

**Files:**
- Create: `src/features/condiciones/condiciones-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear resumen de cobertura**

Mostrar:

```txt
clientes completos
clientes incompletos
porcentaje cobertura comercial
```

- [ ] **Step 2: Crear cards por cliente**

Mostrar descuento permitido, plazo permitido, responsable, estado completa/incompleta e impacto operativo.

- [ ] **Step 3: Conectar navegación**

Agregar caso `condiciones` en `renderView()`.
Pasar `dataset` por props. No importar `mock-index.ts` desde la vista.

- [ ] **Step 4: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/features/condiciones src/app/page.tsx
git commit -m "feat: add AYRO NEXO condiciones workflow view"
```

Expected: cobertura comercial visible y clientes sin condiciones destacados.

---

### Task 10: Historial Completo View

**Files:**
- Create: `src/features/historial/historial-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear vista historial completo**

Usar:

```ts
getHistorialOperativo(dataset, config)
```

No usar `historialReciente`.

- [ ] **Step 2: Agregar filtro por entidad**

Filtros:

```txt
Todos / cliente / pedido / negociacion / alerta
```

- [ ] **Step 3: Conectar navegación**

Agregar caso `historial` en `renderView()` y pasar `config`.
Pasar `dataset` por props. No importar `mock-index.ts` desde la vista.

- [ ] **Step 4: Verificar y commitear**

```bash
npm run lint
npm run build
git add src/features/historial src/app/page.tsx
git commit -m "feat: add AYRO NEXO full history view"
```

Expected: muestra eventos base y eventos generados por alertas.

---

### Task 11: QA Visual, Docs y Cierre

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-05-03-ayro-nexo-sprint-2-local-workflows.md`

- [ ] **Step 1: Ejecutar checks finales**

```bash
npm run lint
npm run build
git diff --check
Select-String -Path "src\features\**\*.tsx" -Pattern "@/data/mock-index"
```

Expected: todos pasan.
El `Select-String` no debe devolver resultados.

- [ ] **Step 2: Validar en navegador**

Abrir `http://localhost:3000` y confirmar:

```txt
Dashboard navega y conserva metricas.
Clientes muestra detalle.
Pedidos simula evaluacion.
Negociaciones agrupa estados.
Condiciones muestra cobertura.
Historial muestra todo.
Configuraciones alterna 24h/48h.
El cambio de umbral recalcula alertas/historial.
Mobile no tiene overflow horizontal.
```

- [ ] **Step 3: Actualizar README**

Agregar estado de Sprint 2:

```md
Sprint 2: workflows locales frontend-only.

Incluye navegacion interna, vistas operables, simulacion de pedido, configuraciones vivas e historial completo. Sigue sin backend, DB, auth, APIs ni persistencia.
```

- [ ] **Step 4: Marcar este plan como completado**

Marcar los checks ejecutados de Task 11 como `[x]`.

- [ ] **Step 5: Commit de cierre**

```bash
git add README.md docs/superpowers/plans/2026-05-03-ayro-nexo-sprint-2-local-workflows.md
git commit -m "docs: close AYRO NEXO sprint 2 workflows"
```

Expected: repo limpio o solo commits listos para push.
