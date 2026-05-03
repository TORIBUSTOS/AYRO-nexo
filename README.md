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

## Estrategia MVP

El MVP es frontend-first: validar comportamiento, reglas y flujo operativo con datos mock/locales antes de construir backend, base de datos o autenticacion.

No forman parte del primer ciclo:

- Prisma
- PostgreSQL
- autenticacion
- APIs externas
- backend propio
- persistencia

## Modulos objetivo

- Dashboard Operativo
- Cola de Accion
- Clientes
- Pedidos
- Negociaciones
- Condiciones Comerciales
- Historial
- Alertas Operativas

## Workflow actual

Sprint 1: Frontend operativo mock.

Completado:

1. Tipos TypeScript de dominio.
2. Mock data centralizada.
3. Reglas locales de negocio.

Pendiente:

1. Selectors del dashboard.
2. Refactor de `src/app/page.tsx` para usar datos derivados.
3. QA visual y validacion contra blueprint.

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
