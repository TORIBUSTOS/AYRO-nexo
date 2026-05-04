# AYRO NEXO - Next Steps

## Estado actual

AYRO NEXO ya funciona como demo operativa frontend-first:

- Dashboard operativo.
- Clientes, pedidos, negociaciones, condiciones, historial y configuraciones.
- Acciones locales: crear pedido, cambiar estado, aprobar/rechazar negociacion, editar condiciones y editar cliente.
- Persistencia local en navegador mediante `localStorage`.
- Adapter de datos preparado para reemplazar persistencia local por backend real.
- Seguimiento comercial de clientes dormidos segun ultimo pedido.

No hay todavia:

- backend real;
- base de datos;
- autenticacion;
- roles/permisos;
- APIs externas;
- auditoria real multiusuario.

## Que ya esta validado

- El flujo comercial se entiende de punta a punta.
- La UI ya no es solo visual: permite operar una demo persistente.
- Las vistas no dependen directamente de mocks ni de `localStorage`.
- La migracion a datos reales esta preparada desde la capa `src/data`.
- Configuraciones evita cambios chicos de codigo para umbrales operativos.

## Que falta validar con usuario o cliente

Antes de construir backend, conviene validar:

1. Si los estados de pedido son suficientes:
   - Armado
   - Negociacion
   - Confirmado
   - Entregado

2. Si los responsables actuales alcanzan o hacen falta roles reales.

3. Si las alertas operativas son las correctas:
   - aprobacion requerida;
   - cliente sin condiciones;
   - pedido sin respuesta;
   - cliente dormido.

4. Si el umbral de cliente dormido debe ser global o por cliente.

5. Si las condiciones comerciales requieren mas campos:
   - descuento permitido;
   - plazo permitido;
   - volumen minimo;
   - frecuencia de compra;
   - observaciones comerciales.

6. Si el historial debe registrar solo acciones manuales o tambien cambios automaticos.

## Proximo sprint recomendado

### Sprint 5 - Backend minimo preparatorio

Objetivo:

Reemplazar la persistencia local por una base real minima sin reescribir la UI.

Alcance recomendado:

1. Definir modelo de datos final v1.
2. Crear capa de repositorio remoto compatible con el adapter actual.
3. Persistir entidades principales:
   - clientes;
   - pedidos;
   - negociaciones;
   - condiciones comerciales;
   - eventos de historial.
4. Mantener las vistas recibiendo `dataset`, `config` y callbacks.
5. Agregar seed inicial equivalente al mock actual.
6. Mantener autenticacion fuera si no es necesaria para validar el MVP.

## Decision tecnica pendiente

Elegir una ruta:

### Opcion A - Backend minimo simple

- API propia dentro de Next.js.
- Persistencia con SQLite o Postgres.
- Mas control del modelo.
- Mejor para evolucionar a sistema real.

### Opcion B - Seguir demo local

- Pulir mas UX antes de backend.
- Agregar mejores validaciones y filtros.
- Menor costo inmediato.
- Riesgo: seguir acumulando comportamiento sin datos reales.

### Opcion C - Backend externo despues

- Mantener adapter actual.
- Preparar contrato de datos.
- Elegir proveedor/base mas adelante.
- Bueno si todavia no esta decidido donde va a correr el sistema.

## Recomendacion

La siguiente mejor jugada es Sprint 5 con backend minimo simple, pero acotado:

- primero modelo;
- despues persistencia;
- despues API;
- despues reemplazo del adapter local;
- al final QA contra la misma UI actual.

No conviene agregar autenticacion, permisos complejos ni automatizaciones antes de tener datos reales persistidos.

## No hacer todavia

- No agregar Prisma si el modelo todavia puede cambiar mucho.
- No agregar auth antes de definir usuarios reales.
- No crear modulos nuevos grandes.
- No duplicar reglas entre frontend y backend.
- No conectar APIs externas antes de estabilizar entidades.
- No reescribir UI para adaptarse al backend.

## Criterio de exito del proximo sprint

El usuario debe poder:

1. Abrir AYRO NEXO.
2. Ver datos reales persistidos.
3. Crear o modificar pedidos.
4. Editar clientes y condiciones.
5. Aprobar o rechazar negociaciones.
6. Ver historial guardado.
7. Refrescar navegador sin perder datos.

Y el equipo debe poder cambiar la fuente de datos sin modificar las vistas principales.
