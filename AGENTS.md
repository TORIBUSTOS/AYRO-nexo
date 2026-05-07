# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Contexto obligatorio para agentes y colaboradores

AYRO NEXO ya no debe interpretarse solamente como un CRM comercial simple.

El proyecto nació como MVP frontend-first centrado en clientes, pedidos, negociación y aprobaciones. Después de revisar datos reales de AYRO, el sistema debe evolucionar hacia un sistema operativo comercial con seguimiento de órdenes, proveedores, facturación, diferencias operativas, direcciones logísticas, alertas e historial.

## Documentos que deben leerse antes de modificar dominio, backend o datos

- `docs/prd/ayro-nexo-transmutacion-operativa-v1.md`
- `docs/prd/entidades-operativas-v1.md`
- `docs/sprints/sprint-4-5-transmutacion.md`
- `docs/architecture/data-import-strategy.md`
- `docs/canon/data-governance.md`

## Principios de trabajo

1. La operación real tiene prioridad sobre la arquitectura teórica.
2. No crear entidades sin evidencia operativa.
3. No subir datos reales sensibles al repo público.
4. No meter backend complejo hasta estabilizar el modelo operativo v1.
5. No duplicar reglas entre UI, frontend domain y backend futuro.
6. Mantener la separación actual entre `src/app`, `src/features`, `src/domain` y `src/data`.
7. La UI debe consumir `dataset`, `config` y callbacks; no debe depender directo de mocks, localStorage o backend.

## Foco de Sprint 4.5

- reemplazar el modelo mental de `Pedido` abstracto por `OrdenComercial`;
- incorporar `Proveedor` como entidad principal;
- separar estado operativo de estado de facturación;
- modelar direcciones de clientes;
- detectar diferencias entre ordenado y facturado;
- preparar importación segura de datos reales;
- evitar mocks irreales o redundantes.

## Lo que se espera de colaboradores humanos

Eli, Charo y cualquier persona que aporte datos reales deben ayudar a detectar:

- reglas tácitas;
- estados usados en la práctica;
- columnas relevantes;
- datos redundantes;
- excepciones comerciales;
- relaciones reales entre cliente, proveedor, orden y factura.

## Regla de seguridad

Los Excel reales y datos sensibles deben vivir fuera del repo público. Usar archivos anonimizados o fixtures mínimos para desarrollo.
