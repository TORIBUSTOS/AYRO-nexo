# Arquitectura

Monolito frontend modular, con dominio y datos separados de la UI.

## Capas

- `src/app`: composicion de vistas y estado raiz.
- `src/features`: pantallas operativas desacopladas de la fuente de datos.
- `src/domain`: tipos, reglas, selectors, operaciones locales y configuracion.
- `src/data`: frontera de datos. Hoy usa mocks y persistencia local; manana puede reemplazarse por backend.

## Core

- Cliente
- Pedido
- Condicion Comercial
- Negociacion
- EventoHistorial

## Flujo

Consulta -> Armado -> Negociacion -> Confirmado -> Entregado

## Persistencia actual

La demo persiste en `localStorage` mediante `src/data/ayro-demo-repository.ts`.

La UI no accede directo a `localStorage`; consume `dataset`, `config` y callbacks desde `src/data/use-ayro-demo-state.ts`.

## Migracion backend

Para pasar a backend real, reemplazar el repositorio local por un repositorio remoto con el mismo contrato operativo:

- cargar estado inicial;
- guardar cambios;
- resetear o rehidratar demo cuando corresponda.

Las vistas no deberian cambiar para esta migracion.
