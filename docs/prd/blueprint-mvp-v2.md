# Blueprint TORO: AYRO NEXO MVP v2

## 0. Resumen Ejecutivo

**AYRO NEXO** es un sistema operativo comercial modular para ordenar la operación de AYRO desde el cliente hasta el pedido, negociación, aprobación, confirmación, entrega y seguimiento.

La estrategia recomendada es **frontend-first**: validar el flujo comercial con datos mock/locales persistentes y reglas simuladas antes de construir backend, base de datos o autenticación.

La prioridad del MVP no es tener una app completa, sino confirmar que el sistema responde claramente:

> ¿Qué pedidos están activos?  
> ¿Qué está trabado?  
> ¿Quién debe resolverlo?  
> ¿Qué acción corresponde ahora?

## 1. Identidad

- **Nombre**: AYRO NEXO
- **Tipo de Sistema**: Sistema operativo comercial modular, frontend-first en etapa MVP.
- **Estado Demo**: Operativa persistente en navegador, con adapter local reemplazable por backend real.
- **Propósito Principal**: Ordenar la operación comercial de AYRO, conectando clientes, pedidos, negociaciones, condiciones comerciales, responsables, alertas e historial en una vista operativa única.
- **Usuarios/Stakeholders**: operación comercial AYRO, responsables de ventas, responsables de aprobación comercial y dirección TORO/AYRO.
- **Resultado Principal**: visibilidad, control y priorización del flujo comercial desde armado de pedido hasta confirmación, entrega y seguimiento operativo.

## 2. Principio Estratégico del MVP

El MVP debe validar **comportamiento**, no infraestructura.

Antes de construir backend, el frontend debe demostrar que:

- los datos necesarios están bien definidos;
- los estados del pedido son claros;
- las reglas comerciales se entienden;
- las alertas son útiles;
- el dashboard ayuda a decidir;
- cada problema tiene responsable;
- el flujo se puede usar con casos reales de AYRO.

## 3. Regla importante de UI

No hardcodear en `src/app/page.tsx`:

- colores;
- themes;
- variantes visuales;
- labels de estados;
- severidades;
- prioridades;
- textos operativos repetidos;
- datos mock;
- reglas de negocio.

La pantalla debe renderizar desde datos centralizados, selectors, reglas locales, constantes/tokens de UI y componentes reutilizables.

## 4. Mapa Funcional

- Dashboard Operativo
- Cola de Acción
- Clientes
- Pedidos
- Negociaciones
- Condiciones Comerciales
- Historial
- Alertas Operativas
- Configuraciones

## 5. Entradas del Sistema

### Cliente

- id
- nombre
- estado
- responsable comercial
- datos operativos mínimos
- condiciones comerciales asociadas

### Pedido

- id
- cliente
- bultos
- fecha
- estado
- prioridad
- responsable
- observaciones
- descuento solicitado
- plazo solicitado

### Condición Comercial

- cliente
- descuento permitido
- plazo permitido
- reglas por cliente
- estado de vigencia

### Negociación

- pedido asociado
- motivo
- estado
- aprobación requerida
- responsable de aprobación
- decisión tomada
- comentario de decisión

### EventoHistorial

- entidad afectada
- acción
- fecha
- responsable
- detalle

### AlertaOperativa

- tipo
- severidad
- entidad asociada
- responsable
- estado
- acción sugerida

## 6. Estados Iniciales de Pedido

- Armado
- Negociación
- Confirmado
- Entregado

Estados complementarios futuros:

- Bloqueado
- Cancelado
- Pendiente de Cliente
- Pendiente de Proveedor

## 7. Reglas de Negocio Críticas

- Si descuento solicitado supera el límite permitido, el pedido pasa a `Negociación`.
- Si plazo solicitado supera el límite permitido, el pedido pasa a `Negociación`.
- Un pedido sin cliente asociado no debe avanzar.
- Un cliente sin condiciones comerciales debe generar alerta operativa.
- Un pedido sin respuesta durante más de 24 horas debe generar alerta.
- Toda negociación debe tener responsable.
- Toda alerta debe tener severidad y acción sugerida.
- Todo cambio relevante de estado debe generar evento de historial.
- Toda aprobación o rechazo debe guardar motivo o comentario.

## 8. Backend Futuro

El backend no debe construirse completo hasta validar el flujo frontend-first.

Cuando se valide, debe cubrir:

- clientes;
- pedidos;
- condiciones_comerciales;
- negociaciones;
- eventos_historial;
- alertas_operativas;
- responsables/usuarios.

## 9. Decisión Recomendada

La secuencia correcta es:

```txt
Flujo validado -> Modelo estable -> Backend mínimo -> Persistencia -> Automatización
```

## 10. Definición de Éxito

AYRO NEXO MVP será exitoso si una persona de AYRO puede abrir el dashboard y entender en menos de 30 segundos:

1. qué pedidos están activos;
2. qué pedidos están trabados;
3. qué clientes tienen problemas;
4. qué negociaciones requieren aprobación;
5. quién debe resolver cada cosa;
6. cuál es la próxima acción concreta.
