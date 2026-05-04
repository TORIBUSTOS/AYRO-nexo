# AYRO NEXO

Sistema operativo comercial modular para AYRO.

AYRO NEXO busca ordenar la operacion comercial desde cliente, pedido y negociacion hasta aprobacion, confirmacion, entrega, alertas e historial.

## Estado actual

- Next.js App Router con TypeScript.
- Tailwind CSS, shadcn/ui y lucide-react.
- Dashboard operativo dark ya implementado en `src/app/page.tsx`.
- Blueprint TORO MVP v2 documentado en `BLUEPRINT.md`.
- Planning de implementacion en `docs/superpowers/plans/2026-05-03-ayro-nexo-frontend-mvp-v2.md`.
- Tipos de dominio creados en `src/domain/types.ts`.
- Datos mock centralizados creados en `src/data/`.
- Reglas locales creadas en `src/domain/rules.ts`.
- Selectors del dashboard creados en `src/domain/selectors.ts`.
- Configuraciones base del sistema creadas en `src/domain/settings.ts` y `src/domain/ui-config.ts`.
- Dashboard conectado a datos, selectors y configuracion reutilizable.
- Demo operativa persistente en navegador mediante adapter local reemplazable.
- QA visual desktop/mobile completado contra el blueprint.

## Estrategia MVP

El MVP es frontend-first: validar comportamiento, reglas y flujo operativo con datos mock/locales persistentes antes de construir backend, base de datos o autenticacion.

No forman parte del primer ciclo:

- Prisma
- PostgreSQL
- autenticacion
- APIs externas
- backend propio

La persistencia actual es solo de demo: `localStorage` en el navegador. No reemplaza backend real, pero permite validar el flujo con continuidad entre recargas.

## Regla importante de UI

No hardcodear UI en `src/app/page.tsx`.

Evitar hardcodear:

- colores
- themes
- variantes visuales
- labels de estados
- severidades
- prioridades
- datos mock
- reglas de negocio

La UI debe componerse desde datos centralizados, selectors, reglas locales y constantes/tokens reutilizables. Si un color, label o variante se repite, debe ir a una configuracion compartida y no quedar inline en JSX.

Regla de producto:

> Todo valor que el cliente razonablemente pueda pedir cambiar debe vivir en configuracion, no en componentes.

Esto incluye labels, colores, prioridades, severidades, responsables, umbrales operativos y textos de acciones sugeridas.

## Modulos objetivo

- Dashboard Operativo
- Cola de Accion
- Clientes
- Pedidos
- Negociaciones
- Condiciones Comerciales
- Historial
- Alertas Operativas
- Configuraciones

## Workflow actual

Sprint 1: Frontend operativo mock validado.

Completado:

1. Tipos TypeScript de dominio.
2. Mock data centralizada.
3. Reglas locales de negocio.
4. Selectors del dashboard.
5. Configuracion base del sistema y UI.
6. Refactor de `src/app/page.tsx` para usar datos derivados y configuracion UI sin hardcodeos.
7. QA visual desktop/mobile, consola, lint y build.

Sprint 2: Workflows locales frontend-only validado.

Completado:

1. Frontera de datos en `src/data/source.ts` para reemplazar mocks por datos reales sin reescribir vistas.
2. Tipos y settings para navegacion interna, configuracion local y simulacion de pedidos.
3. Componentes compartidos de AYRO: shell, icon map, badges y rows.
4. Dashboard extraido a `src/features/dashboard/dashboard-view.tsx`.
5. Reglas y selectors configurables por `ConfiguracionLocal`.
6. Vista Configuraciones con toggle local 24h/48h sin persistencia.
7. Vista Clientes con resumen operativo y detalle basico.
8. Vista Pedidos con filtros y simulacion local usando `evaluarPedido`.
9. Vista Negociaciones agrupada por estado.
10. Vista Condiciones Comerciales con cobertura comercial.
11. Vista Historial completo con filtros por entidad.
12. QA final desktop/mobile, consola, lint y build.

Sprint 3: UI/UX operable en memoria validado.

Completado:

1. Dataset local en memoria conectado desde `src/app/page.tsx`.
2. Helpers de operaciones locales con registro de historial.
3. Creacion local de pedidos desde evaluacion comercial.
4. Cambio local de estado de pedidos.
5. Aprobacion/rechazo local de negociaciones.
6. Edicion local de condiciones comerciales por cliente.
7. Edicion local de estado y responsable de clientes.
8. Historial con eventos locales identificados.
9. Reset de datos locales y configuracion inicial desde Configuraciones.
10. QA de lint, build y frontera de datos mock.

Sprint 4: Demo operativa persistente.

Completado:

1. Persistencia local en navegador para dataset y configuracion.
2. Adapter `src/data/ayro-demo-repository.ts` con contrato reemplazable por backend.
3. Hook `src/data/use-ayro-demo-state.ts` para aislar persistencia de la UI.
4. Configuracion inicial movida a `src/domain/default-config.ts`.
5. Vista Configuraciones muestra fuente, modo de persistencia y ultima actualizacion.

Siguiente fase posible:

1. Implementar backend real detras del contrato de repositorio.
2. Reemplazar `localStorage` por API/base de datos sin reescribir vistas.
3. Agregar validaciones, roles y auditoria solo cuando el flujo comercial este validado.

## Persistencia y migracion backend

La UI no lee ni escribe `localStorage` directamente.

Frontera actual:

- `src/data/ayro-demo-repository.ts`: carga, guarda y resetea estado de demo.
- `src/data/use-ayro-demo-state.ts`: conecta React con el repositorio.
- `src/app/page.tsx`: consume `dataset`, `config` y callbacks, sin saber como persisten.

Para migrar a backend real, el cambio esperado es crear un repositorio remoto con el mismo contrato operativo y mantener las vistas recibiendo props/callbacks.

## Comandos

```bash
npm run dev
npm run lint
npm run build
```

Servidor local:

```txt
http://localhost:3000
```

## Documentacion

- `BLUEPRINT.md`: mapa TORO del MVP.
- `docs/superpowers/plans/2026-05-03-ayro-nexo-frontend-mvp-v2.md`: plan de implementacion task-by-task.
- `docs/superpowers/plans/2026-05-03-ayro-nexo-sprint-2-local-workflows.md`: plan Sprint 2 de workflows locales.
- `docs/superpowers/plans/2026-05-04-ayro-nexo-sprint-3-local-ux-operations.md`: plan Sprint 3 de UX operable en memoria.
- `SPEC.md`: entidades y regla base inicial.
- `ARQUITECTURA.md`: arquitectura conceptual.
- `VISION.md` y `MISION.md`: direccion del producto.
