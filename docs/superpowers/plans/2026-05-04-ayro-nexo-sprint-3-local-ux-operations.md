# AYRO NEXO Sprint 3 Local UX Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir AYRO NEXO de una app navegable con simulaciones a una experiencia UI/UX operable en memoria: crear pedidos, cambiar estados, aprobar/rechazar negociaciones, editar condiciones y registrar historial local sin backend ni persistencia.

**Architecture:** Mantener `src/app/page.tsx` como estado raiz temporal del sistema local. Levantar un `localDataset` mutable en memoria desde `getAyroDataset()` y pasar `dataset`, `config` y callbacks de operacion a las vistas. Todas las acciones crean eventos de historial locales para validar trazabilidad antes de construir backend.

**Tech Stack:** Next.js App Router 16.2.4, React 19.2.4, TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react.

---

## Hard Rules

- No agregar backend, DB, Prisma, auth, APIs externas ni persistencia.
- No usar `localStorage` todavia. Estado solo en memoria.
- No importar mocks desde `src/features`; las vistas reciben `dataset` por props.
- No duplicar reglas comerciales. Usar `evaluarPedido`, `generarAlertasOperativas` y selectors.
- Toda accion local relevante debe registrar un `EventoHistorial`.
- La UI debe decir claramente cuando algo es local/no persistente.
- Mantener `page.tsx` razonablemente liviano: si los callbacks crecen demasiado, mover helpers puros a `src/domain/local-operations.ts`.

---

## Product Intent

Sprint 3 no busca datos reales. Busca responder:

```txt
Si el usuario tuviera datos reales manana, el flujo operativo ya se entiende y se puede usar?
```

La app debe dejar de sentirse como pantallas estaticas y pasar a sentirse como un sistema operativo local:

- crear pedido;
- mover pedido de estado;
- aprobar o rechazar negociacion;
- editar condiciones comerciales;
- ver historial generado por acciones;
- recalcular alertas con cada cambio local;
- resetear al dataset mock inicial si hace falta.

---

## File Structure

- Modify `src/domain/types.ts`: agregar tipos de acciones locales y payloads.
- Create `src/domain/local-operations.ts`: helpers puros para crear pedidos, actualizar pedidos, editar clientes/condiciones, cambiar negociaciones y crear eventos.
- Modify `src/app/page.tsx`: reemplazar dataset constante por `useState`, agregar callbacks locales y pasarlos a vistas.
- Modify `src/components/ayro/ayro-shell.tsx`: conectar boton `Nuevo Pedido` con callback opcional.
- Modify `src/features/dashboard/dashboard-view.tsx`: acciones rapidas desde cola/kanban y abrir nuevo pedido.
- Modify `src/features/pedidos/pedidos-view.tsx`: crear pedido local real, cambiar estado, ver detalle y registrar historial.
- Modify `src/features/negociaciones/negociaciones-view.tsx`: aprobar/rechazar negociacion local y reflejar estado.
- Modify `src/features/condiciones/condiciones-view.tsx`: editar condiciones comerciales localmente.
- Modify `src/features/clientes/clientes-view.tsx`: editar estado/responsable localmente.
- Modify `src/features/historial/historial-view.tsx`: mostrar eventos locales generados por acciones.
- Modify `src/features/configuraciones/configuraciones-view.tsx`: agregar reset visual de configuracion y reforzar no persistencia.
- Modify `README.md`: documentar Sprint 3 cuando cierre.

---

## Local Operation Model

### Dataset local

En Sprint 3, `page.tsx` debe pasar de:

```ts
const dataset = useMemo(() => getAyroDataset(), [])
```

a:

```ts
const [dataset, setDataset] = useState<AyroDataset>(() => getAyroDataset())
```

Toda accion modifica este `dataset` en memoria.

### Historial local

Toda accion agrega un `EventoHistorial` al arreglo `dataset.historial`.

Ejemplo:

```ts
{
  id: "evt_local_001",
  entidad: "pedido",
  entidadId: "ped_009",
  accion: "Pedido creado",
  fecha: "2026-05-04 10:30",
  responsable: "Eli",
  detalle: "Pedido local creado para Bazar Norte con 12 bultos."
}
```

### Generacion de ids

No agregar librerias. Usar helpers simples:

```ts
export function createLocalId(prefix: string, count: number) {
  return `${prefix}_${String(count + 1).padStart(3, "0")}`
}
```

---

## Task 1: Local Operation Types

**Files:**
- Modify: `src/domain/types.ts`

- [ ] **Step 1: Add local operation types**

Agregar:

```ts
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
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add src/domain/types.ts
git commit -m "feat: add AYRO NEXO local operation types"
```

---

## Task 2: Local Operation Helpers

**Files:**
- Create: `src/domain/local-operations.ts`

- [ ] **Step 1: Create local operations file**

Create helpers:

```ts
createLocalId(prefix, count)
createLocalEvent(input)
createPedidoLocal(dataset, input)
updatePedidoEstado(dataset, input)
updateCondicionComercial(dataset, input)
updateCliente(dataset, input)
decidirNegociacion(dataset, input)
resetDataset()
```

Each helper must:

- accept `AyroDataset`;
- return a new `AyroDataset`;
- never mutate arrays in place;
- add one `EventoHistorial` when it changes data.

- [ ] **Step 2: Required behavior**

`createPedidoLocal`:

- creates a `Pedido`;
- uses input `estadoInicial`;
- sets `ultimaRespuestaHoras` to `0`;
- appends event `Pedido creado`.

`updatePedidoEstado`:

- changes `pedido.estado`;
- appends event `Estado de pedido actualizado`.

`updateCondicionComercial`:

- changes `cliente.descuentoPermitido` and `cliente.plazoPermitidoDias`;
- appends event `Condiciones actualizadas`.

`decidirNegociacion`:

- sets `negociacion.estado` to `aprobada` or `rechazada`;
- sets `decisionTomada` and `comentarioDecision`;
- appends event `Negociacion aprobada` or `Negociacion rechazada`.

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/domain/local-operations.ts
git commit -m "feat: add AYRO NEXO local operation helpers"
```

---

## Task 3: Wire Local Dataset State

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/ayro/ayro-shell.tsx`

- [ ] **Step 1: Promote dataset to state**

In `page.tsx`:

```ts
const [dataset, setDataset] = useState<AyroDataset>(() => getAyroDataset())
```

- [ ] **Step 2: Add operation callbacks**

Add callbacks:

```ts
crearPedidoLocal(input)
cambiarEstadoPedido(input)
actualizarCondiciones(input)
actualizarCliente(input)
decidirNegociacionLocal(input)
resetearDatosLocales()
```

Callbacks should call `setDataset((current) => helper(current, input))`.

- [ ] **Step 3: Add shell primary action**

In `ayro-shell.tsx`, add optional prop:

```ts
onPrimaryAction?: () => void
```

The `Nuevo Pedido` button should call it.

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/ayro/ayro-shell.tsx
git commit -m "feat: wire AYRO NEXO local dataset state"
```

---

## Task 4: Pedido Creation UX

**Files:**
- Modify: `src/features/pedidos/pedidos-view.tsx`
- Modify: `src/features/dashboard/dashboard-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create real local order from Pedidos**

`PedidosView` should receive:

```ts
onCreatePedido: (input: PedidoLocalInput) => void
onUpdatePedidoEstado: (input: PedidoEstadoUpdate) => void
```

The existing simulation result should expose a button:

```txt
Crear pedido local
```

When clicked:

- create order in local dataset;
- choose initial state from evaluation:
  - `Confirmado` when evaluation suggests Confirmado;
  - `Negociacion` when approval is required;
  - `Armado` as fallback;
- show the new order in list/dashboard until refresh.

- [ ] **Step 2: Header Nuevo Pedido navigates to Pedidos**

`Nuevo Pedido` in shell should switch active view to `pedidos`.

- [ ] **Step 3: Update order state controls**

Each order card in `PedidosView` should expose state buttons:

```txt
Armado / Negociacion / Confirmado / Entregado
```

Clicking updates local state and appends history.

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/features/pedidos/pedidos-view.tsx src/features/dashboard/dashboard-view.tsx
git commit -m "feat: add AYRO NEXO local pedido operations"
```

---

## Task 5: Negociacion Decision UX

**Files:**
- Modify: `src/features/negociaciones/negociaciones-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add decision props**

`NegociacionesView` should receive:

```ts
onDecision: (input: NegociacionDecisionInput) => void
```

- [ ] **Step 2: Add approve/reject buttons**

For pending/bloqueada cards, render:

```txt
Aprobar
Rechazar
```

Clicking updates negotiation state and appends history.

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/features/negociaciones/negociaciones-view.tsx
git commit -m "feat: add AYRO NEXO local negotiation decisions"
```

---

## Task 6: Condiciones Editing UX

**Files:**
- Modify: `src/features/condiciones/condiciones-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add edit controls**

Each client condition card should allow editing:

```txt
descuentoPermitido
plazoPermitidoDias
```

- [ ] **Step 2: Save locally**

Add button:

```txt
Guardar condiciones
```

It calls:

```ts
onUpdateCondicion(input)
```

and appends history.

- [ ] **Step 3: Verify alert recalculation**

After editing a client without conditions, Dashboard alert count should change according to rules.

- [ ] **Step 4: Verify and commit**

```bash
npm run lint
npm run build
git add src/app/page.tsx src/features/condiciones/condiciones-view.tsx
git commit -m "feat: add AYRO NEXO local condition editing"
```

---

## Task 7: Cliente Detail Editing UX

**Files:**
- Modify: `src/features/clientes/clientes-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add basic editable fields**

Allow local changes to:

```txt
estado
responsable
```

- [ ] **Step 2: Save locally**

Button:

```txt
Guardar cliente
```

Calls `onUpdateCliente(input)` and appends history.

- [ ] **Step 3: Verify and commit**

```bash
npm run lint
npm run build
git add src/app/page.tsx src/features/clientes/clientes-view.tsx
git commit -m "feat: add AYRO NEXO local client editing"
```

---

## Task 8: Historial and Reset UX

**Files:**
- Modify: `src/features/historial/historial-view.tsx`
- Modify: `src/features/configuraciones/configuraciones-view.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Historial highlights local events**

Events with id prefix `evt_local_` should show a local badge:

```txt
Local
```

- [ ] **Step 2: Add reset local data control**

In Configuraciones, add:

```txt
Resetear datos locales
```

It restores dataset from `getAyroDataset()` and config from `initialConfig`.

- [ ] **Step 3: Verify and commit**

```bash
npm run lint
npm run build
git add src/app/page.tsx src/features/historial/historial-view.tsx src/features/configuraciones/configuraciones-view.tsx
git commit -m "feat: add AYRO NEXO local history and reset UX"
```

---

## Task 9: UX QA Polish

**Files:**
- Modify only if needed: `src/features/**`
- Modify: `README.md`
- Modify: this plan

- [ ] **Step 1: Full checks**

```bash
npm run lint
npm run build
git diff --check
Select-String -Path "src\features\**\*.tsx" -Pattern "@/data/mock-index"
```

Expected:

- lint passes;
- build passes;
- diff check passes;
- no direct mock imports in features.

- [ ] **Step 2: Browser QA**

Validate:

- create local pedido from Pedidos;
- new pedido appears in list/dashboard;
- change pedido status;
- approve/reject negotiation;
- edit conditions and verify alerts recalculate;
- edit client state/responsible;
- history shows local events;
- reset restores mock data;
- mobile has no horizontal overflow;
- console has no errors.

- [ ] **Step 3: Docs**

Update `README.md`:

```md
Sprint 3: UI/UX operable en memoria validado.

Incluye acciones locales para pedidos, negociaciones, clientes, condiciones, historial y reset. Sigue sin backend, DB, auth, APIs ni persistencia.
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/superpowers/plans/2026-05-04-ayro-nexo-sprint-3-local-ux-operations.md
git commit -m "docs: close AYRO NEXO sprint 3 local UX"
```

---

## Acceptance Criteria

- `Nuevo Pedido` lleva al flujo de pedidos.
- Pedidos permite crear un pedido local desde una evaluacion.
- Pedidos permite cambiar estado localmente.
- Negociaciones permite aprobar/rechazar en memoria.
- Condiciones permite editar limites en memoria.
- Clientes permite editar estado/responsable en memoria.
- Historial registra acciones locales.
- Configuraciones permite resetear datos locales.
- Alertas y cola se recalculan tras cambios locales.
- No hay backend, DB, auth, APIs, Prisma ni persistencia.
- `npm run lint` pasa.
- `npm run build` pasa.
- Browser QA desktop/mobile pasa.

---

## Out Of Scope

- Guardar datos al refrescar.
- Conectar APIs.
- Login/roles/permisos.
- Validaciones complejas.
- Tablas avanzadas.
- Auditoria real.
- Multiusuario.
