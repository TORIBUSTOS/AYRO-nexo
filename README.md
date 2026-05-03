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
- QA visual desktop/mobile completado contra el blueprint.

## Estrategia MVP

El MVP es frontend-first: validar comportamiento, reglas y flujo operativo con datos mock/locales antes de construir backend, base de datos o autenticacion.

No forman parte del primer ciclo:

- Prisma
- PostgreSQL
- autenticacion
- APIs externas
- backend propio
- persistencia

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
- `SPEC.md`: entidades y regla base inicial.
- `ARQUITECTURA.md`: arquitectura conceptual.
- `VISION.md` y `MISION.md`: direccion del producto.
