# Data Import Strategy — AYRO NEXO

## Objetivo

Definir una estrategia segura para transformar Excel reales en entidades operativas sin acoplar la UI ni subir datos sensibles al repositorio.

## Principio

La importación debe ser una frontera de datos, igual que la persistencia.

La UI no debe leer Excel directamente.

## Etapas

### 1. Raw import

Convertir filas de Excel a estructuras crudas:

- `RawVentaRow`
- `RawDireccionRow`

Estas estructuras preservan el dato original sin decidir todavía el significado final.

### 2. Normalización

Transformar los datos crudos en entidades del dominio:

- `ClienteOperativo`
- `Proveedor`
- `DireccionCliente`
- `OrdenComercial`

### 3. Validación

Detectar problemas:

- cliente faltante;
- proveedor faltante;
- fecha inválida;
- monto inválido;
- factura sin orden;
- orden sin factura;
- dirección incompleta.

### 4. Revisión humana

Antes de persistir en backend, los casos ambiguos deben pasar por revisión humana.

## Reglas de importación

1. Los headers deben normalizarse por alias.
2. Las fechas Excel serial deben convertirse a ISO date.
3. No descartar filas con factura aunque no tengan monto de orden.
4. No asumir que una fila equivale siempre a una orden cerrada.
5. Permitir agrupación posterior por cliente, proveedor, fecha y factura.
6. Mantener referencia de origen para auditoría.

## Carpetas recomendadas futuras

```txt
src/data/import-schema.ts
src/data/import-normalizers.ts
src/data/import-validators.ts
```

## Seguridad

Los archivos reales deben guardarse fuera del repo público.

Usar fixtures anonimizados para desarrollo.
