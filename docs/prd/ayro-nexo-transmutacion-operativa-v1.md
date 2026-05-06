# AYRO NEXO — Transmutación Operativa v1

## Objetivo

Reencaminar AYRO NEXO desde un MVP comercial abstracto hacia un sistema operativo comercial alineado con la operación real detectada en los Excel de AYRO.

---

## Hallazgos Reales

Los datos reales muestran que la operación gira alrededor de:

- órdenes comerciales;
- clientes;
- proveedores;
- facturación;
- diferencias entre ordenado y facturado;
- logística/direcciones;
- seguimiento operativo.

Esto implica que el modelo original centrado solo en “pedido/negociación” quedó corto.

---

## Nueva Dirección Estratégica

AYRO NEXO debe evolucionar hacia:

> Sistema operativo comercial y de seguimiento operativo/facturación.

No solo CRM comercial.

---

## Nuevas Entidades

### Cliente

- id
- nombre
- estado
- responsable
- observaciones

### DirecciónCliente

- clienteId
- dirección
- tipo
- localidad

### Proveedor

- id
- nombre
- estado
- contacto

### OrdenComercial

- fecha
- clienteId
- proveedorId
- montoOrden
- montoFacturado
- facturaNumero
- estadoOperativo
- estadoFacturación
- observaciones

### EventoHistorial

- entidad
- acción
- responsable
- fecha
- detalle

### AlertaOperativa

- tipo
- severidad
- responsable
- acción sugerida

---

## Nuevos Estados

### Operativos

- Pendiente
- Ordenado
- En Seguimiento
- Entregado
- Observado
- Bloqueado

### Facturación

- Sin Facturar
- Parcial
- Facturado
- Diferencia Detectada

---

## Nuevas Alertas

- diferencia entre orden y facturado;
- orden sin factura;
- cliente sin dirección;
- proveedor observado;
- orden bloqueada;
- cliente dormido.

---

## Sprint 4.5 — Transmutación Operativa

Objetivo:

alinear el modelo conceptual con la operación real.

### Alcance

1. Redefinir entidades.
2. Incorporar proveedor.
3. Incorporar direcciones.
4. Separar estado operativo y facturación.
5. Crear nuevos mocks.
6. Redefinir alertas.
7. Ajustar KPIs.
8. Ajustar dashboard.
9. Mantener compatibilidad frontend.

---

## Sprint 5 — Backend mínimo real

1. Modelo final v1.
2. SQLite/Postgres.
3. API mínima.
4. Persistencia.
5. Seed inicial.
6. Adapter remoto.
7. QA.

---

## Decisión Estratégica

Secuencia correcta:

```txt
Excel reales
-> Transmutación conceptual
-> Modelo operativo real
-> Nuevos specs
-> Ajuste dashboard
-> Backend mínimo
-> Persistencia real
```
