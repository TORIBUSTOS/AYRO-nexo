# Frontend Architecture

## Arquitectura Actual

AYRO NEXO utiliza una arquitectura frontend modular basada en:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

## Capas

### src/app

Composición principal, navegación y estado raíz.

### src/features

Pantallas operativas desacopladas de la fuente de datos.

### src/domain

- tipos;
- reglas;
- selectors;
- configuración;
- operaciones locales.

### src/data

Frontera de datos.

Actualmente utiliza:

- mocks;
- persistencia local;
- adapter reemplazable.

## Principio Importante

La UI no debe depender de:

- localStorage;
- backend;
- mocks directos.

Debe consumir:

- dataset;
- config;
- callbacks.

## Estrategia Backend

El backend futuro debe reemplazar únicamente la implementación de repositorio.

Las vistas no deberían reescribirse.
