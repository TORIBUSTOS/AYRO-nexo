# Sprint 4.5 — Transmutación Operativa

## Objetivo

Reencaminar AYRO NEXO desde el MVP comercial abstracto hacia un modelo operativo real basado en datos de AYRO.

Este sprint no busca agregar pantallas por volumen. Busca estabilizar dominio, datos y reglas antes del backend.

## Inputs usados

- Excel de ventas mensuales.
- Excel de direcciones de clientes.
- Estado actual del MVP frontend-first.
- Documento `docs/prd/ayro-nexo-transmutacion-operativa-v1.md`.

## Decisión central

El sistema debe pasar de estar centrado solo en `Pedido` a estar centrado en:

- Orden Comercial;
- Cliente;
- Proveedor;
- Facturación;
- Dirección logística;
- Historial;
- Alertas operativas.

## Alcance funcional

### 1. Modelo operativo v1

Definir entidades nuevas:

- `ClienteOperativo`
- `DireccionCliente`
- `Proveedor`
- `OrdenComercial`
- `EventoOperativo`
- `AlertaOperativaReal`

### 2. Estados nuevos

Separar estado operativo de estado de facturación.

#### Estado operativo

- pendiente
- ordenada
- en_seguimiento
- entregada
- observada
- bloqueada

#### Estado de facturación

- sin_facturar
- parcial
- facturada
- diferencia_detectada

### 3. Normalización de datos reales

Crear criterio de importación para ventas y direcciones.

No se deben subir datos reales sensibles al repo público.

### 4. Reglas nuevas

Definir reglas para detectar:

- orden sin facturar;
- facturación parcial;
- diferencia de facturación;
- cliente sin dirección;
- proveedor observado;
- registros incompletos.

### 5. Dashboard futuro

Preparar KPIs futuros:

- órdenes activas;
- órdenes sin factura;
- órdenes parcialmente facturadas;
- diferencias detectadas;
- clientes con dirección incompleta;
- proveedores activos.

## Fuera de alcance

- Backend real.
- Autenticación.
- Carga masiva definitiva.
- Facturación fiscal formal.
- Integraciones externas.
- Reescritura completa de UI.

## Entregables

1. Documentación de entidades operativas v1.
2. Estrategia de importación de Excel.
3. Guía de gobierno de datos.
4. Tipos TypeScript nuevos y no disruptivos.
5. Reglas iniciales de facturación y alertas.
6. Mapeo de columnas esperado.

## Criterio de éxito

El sprint queda validado cuando:

1. existe modelo operativo real v1;
2. los Excel pueden mapearse a entidades claras;
3. se documentan reglas tácitas detectadas;
4. el repo evita subir datos sensibles;
5. el backend futuro puede diseñarse sobre entidades reales y no sobre mocks abstractos.
