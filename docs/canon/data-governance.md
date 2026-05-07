# Data Governance — AYRO NEXO

## Regla principal

No subir datos reales sensibles al repositorio público.

Esto incluye:

- Excel reales;
- nombres de clientes sensibles;
- importes reales;
- números de factura reales;
- direcciones completas;
- contactos;
- condiciones comerciales privadas.

## Cómo trabajar con datos reales

### Permitido

- analizar localmente;
- crear conclusiones estructurales;
- crear fixtures anonimizados;
- documentar campos y reglas sin exponer datos sensibles;
- guardar archivos reales en una ubicación privada fuera del repo.

### No permitido

- commitear Excel reales;
- commitear dumps de producción;
- commitear facturas reales;
- commitear direcciones completas reales;
- publicar importes exactos si el repo es público.

## Recomendación de carpetas locales ignoradas

Usar localmente:

```txt
data/private/
docs/research/private/
```

Estas carpetas deben estar en `.gitignore`.

## Fixtures

Los fixtures de desarrollo deben ser:

- mínimos;
- anonimizados;
- representativos de casos reales;
- suficientes para validar reglas.

Ejemplos de casos que sí deben existir como fixture:

- orden sin factura;
- orden parcialmente facturada;
- factura sin monto de orden en la misma línea;
- cliente con dos direcciones;
- cliente sin dirección;
- proveedor observado.
