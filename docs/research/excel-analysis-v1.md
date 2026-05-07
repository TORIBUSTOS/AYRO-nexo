# Excel Analysis v1 — AYRO NEXO

## Propósito

Registrar hallazgos estructurales de los Excel reales sin exponer datos sensibles del negocio.

Este documento evita publicar nombres, importes exactos o información privada porque el repositorio puede ser visible por terceros.

## Archivos revisados

- Ventas mensuales de diciembre a abril.
- Direcciones de clientes.

## Hallazgos estructurales

### 1. Ventas

Las planillas de ventas contienen una estructura base con:

- fecha;
- cliente;
- proveedor;
- monto de orden;
- monto facturado;
- número de factura.

### 2. Variación de columnas

No todos los meses mantienen exactamente el mismo orden de columnas.

Ejemplo estructural:

- algunos archivos comienzan con fecha;
- otro archivo comienza con proveedor y deja fecha al final como fecha OC.

Conclusión: se necesita una capa de normalización de headers antes de importar.

### 3. Proveedor es entidad central

Los datos muestran que proveedor no es un campo secundario. Debe ser entidad propia.

### 4. Facturación es parte del flujo operativo

Hay líneas con:

- orden sin facturación;
- facturación sin monto de orden en la misma línea;
- facturación parcial;
- diferencias entre orden y factura.

Esto puede deberse a facturas parciales, líneas de continuación, ajustes o datos incompletos. No debe resolverse con una regla simplista de una fila = una orden cerrada.

### 5. Direcciones

La planilla de direcciones muestra:

- clientes con una dirección;
- clientes con más de una dirección;
- clientes sin dirección completa;
- marcas manuales como visitas o seguimiento.

Conclusión: `DireccionCliente` debe ser entidad propia y no solo texto dentro de cliente.

## Riesgos detectados

1. Importar sin normalizar headers.
2. Tratar cada fila como una orden independiente sin agrupar.
3. Perder facturas parciales.
4. Confundir diferencia real con línea complementaria.
5. Subir Excel reales al repo público.
6. Crear mocks que no representen continuidad, facturación parcial y direcciones múltiples.

## Recomendación

Crear un importador en dos etapas:

1. Parseo bruto a `RawVentaRow` / `RawDireccionRow`.
2. Normalización validada hacia entidades operativas.

Antes del backend, validar con Eli y Charo qué significan las líneas con importes parciales o datos incompletos.
