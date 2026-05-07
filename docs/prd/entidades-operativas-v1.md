# Entidades Operativas v1 — AYRO NEXO

## Objetivo

Definir el nuevo modelo operativo real de AYRO NEXO antes de construir backend.

El modelo anterior basado en `Pedido` sigue siendo útil como MVP, pero debe evolucionar hacia `OrdenComercial` con facturación, proveedor y trazabilidad.

## Entidades principales

### ClienteOperativo

Representa a un cliente real de AYRO.

Campos sugeridos:

- `id`
- `nombre`
- `estado`
- `responsable`
- `observaciones`
- `ultimoMovimientoFecha`

### DireccionCliente

Representa una dirección logística asociada a un cliente.

Campos sugeridos:

- `id`
- `clienteId`
- `direccion`
- `tipo`
- `localidad`
- `provincia`
- `observaciones`
- `requiereVisita`

### Proveedor

Proveedor asociado a órdenes comerciales.

Campos sugeridos:

- `id`
- `nombre`
- `estado`
- `contacto`
- `observaciones`

### OrdenComercial

Entidad central del nuevo modelo.

Campos sugeridos:

- `id`
- `fechaOrden`
- `clienteId`
- `proveedorId`
- `montoOrden`
- `montoFacturado`
- `facturaNumero`
- `estadoOperativo`
- `estadoFacturacion`
- `observaciones`
- `origenImportacion`

### EventoOperativo

Registro histórico de cambios.

Campos sugeridos:

- `id`
- `entidad`
- `entidadId`
- `accion`
- `fecha`
- `responsable`
- `detalle`

### AlertaOperativaReal

Alerta derivada del estado real de órdenes, facturación, direcciones o proveedores.

Campos sugeridos:

- `id`
- `tipo`
- `severidad`
- `entidadAsociada`
- `entidadId`
- `responsable`
- `estado`
- `accionSugerida`

## Estados

### EstadoOperativoOrden

- `pendiente`
- `ordenada`
- `en_seguimiento`
- `entregada`
- `observada`
- `bloqueada`

### EstadoFacturacionOrden

- `sin_facturar`
- `parcial`
- `facturada`
- `diferencia_detectada`

## Reglas iniciales

1. Si existe orden y no existe facturación, estado de facturación = `sin_facturar`.
2. Si la facturación es menor al monto ordenado, estado de facturación = `parcial`.
3. Si la facturación supera el monto ordenado, estado de facturación = `diferencia_detectada`.
4. Si una línea tiene factura sin monto de orden, no debe descartarse: puede ser continuación de una orden o dato incompleto.
5. Si cliente no tiene dirección válida, debe generar alerta logística.
6. Si proveedor está observado, nuevas órdenes deben marcarse como observadas.

## Decisión de producto

No eliminar todavía `Pedido` del sistema actual.

La migración debe ser progresiva:

```txt
Pedido MVP -> OrdenComercial operativa
```

Primero se agregan tipos y reglas nuevas. Después se decide si las vistas actuales se adaptan o se crean vistas nuevas de Órdenes.
