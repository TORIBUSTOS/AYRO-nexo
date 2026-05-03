# Blueprint TORO: AYRO NEXO MVP v2

## 0. Resumen Ejecutivo

**AYRO NEXO** es un sistema operativo comercial modular para ordenar la operación de AYRO desde el cliente hasta el pedido, negociación, aprobación, confirmación, entrega y seguimiento.

La estrategia recomendada es **frontend-first**: validar el flujo comercial con datos mock/locales y reglas simuladas antes de construir backend, base de datos o autenticación.

La prioridad del MVP no es tener una app completa, sino confirmar que el sistema responde claramente:

> ¿Qué pedidos están activos?  
> ¿Qué está trabado?  
> ¿Quién debe resolverlo?  
> ¿Qué acción corresponde ahora?

---

## 1. Identidad

- **Nombre**: AYRO NEXO
- **Tipo de Sistema**: Sistema operativo comercial modular, frontend-first en etapa MVP.
- **Propósito Principal**: Ordenar la operación comercial de AYRO, conectando clientes, pedidos, negociaciones, condiciones comerciales, responsables, alertas e historial en una vista operativa única.
- **Usuarios/Stakeholders**:
  - Operación comercial AYRO
  - Responsables de ventas
  - Responsables de aprobación comercial
  - Dirección TORO/AYRO
- **Resultado Principal que Entrega**: Visibilidad, control y priorización del flujo comercial desde armado de pedido hasta confirmación, entrega y seguimiento operativo.

---

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

### Regla importante de UI

La UI no debe depender de hardcodeos sueltos en la pantalla principal.

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

La pantalla debe renderizar desde:

- datos centralizados;
- selectors;
- reglas locales;
- constantes/tokens de UI;
- componentes reutilizables.

Si un color, estado visual o label se repite, debe vivir en una configuración compartida, no inline dentro del JSX.

---

## 3. Mapa Funcional

### Funciones Principales

- **Dashboard Operativo**: Resume pedidos activos, negociaciones, confirmados del día, clientes activos, alertas y prioridades.
- **Cola de Acción**: Lista priorizada de situaciones que requieren decisión o intervención.
- **Clientes**: Centraliza datos mínimos del cliente y su estado operativo.
- **Pedidos**: Registra pedidos, bultos, fecha, estado, observaciones, prioridad y responsable.
- **Negociaciones**: Gestiona pedidos que requieren revisión, aprobación o respuesta comercial.
- **Condiciones Comerciales**: Define límites por cliente para descuento, plazo y reglas operativas.
- **Historial**: Registra eventos relevantes de clientes, pedidos, negociaciones y decisiones.
- **Alertas Operativas**: Muestra situaciones que requieren acción: aprobaciones, clientes sin condiciones, pedidos sin respuesta y casos bloqueados.
- **Configuraciones**: Centraliza valores modificables por cliente para evitar cambios de codigo por ajustes menores.

---

## 4. Entradas del Sistema

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
- warning operativo opcional

### CondicionComercial

- cliente
- descuento permitido
- plazo permitido
- reglas por cliente
- estado de vigencia

### Negociacion

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

### ConfiguracionSistema

- identidad visible del sistema
- labels de modulos
- labels de estados
- labels de prioridades
- labels de severidades
- responsables disponibles
- umbrales operativos
- limites comerciales default
- variantes visuales configurables

---

## 5. Procesos Clave

### Carga de cliente

Datos mínimos del cliente -> cliente disponible para pedidos.

Si el cliente no tiene condiciones comerciales, se genera alerta operativa.

### Carga de pedido

Cliente + bultos + fecha + observaciones + descuento/plazo solicitado -> pedido en estado `Armado`.

### Evaluación comercial

Pedido + condición comercial -> pedido confirmado o enviado a `Negociación`.

### Gestión de negociación

Motivo + aprobación/rechazo/respuesta -> pedido confirmado, pendiente o bloqueado.

### Cierre operativo

Pedido confirmado -> pedido entregado.

### Registro histórico

Cambio de estado o decisión clave -> evento de historial.

### Generación de alertas

Pedidos, clientes, condiciones y tiempos de respuesta -> alertas visibles en dashboard.

---

## 6. Estados Iniciales de Pedido

- **Armado**: pedido cargado o en preparación.
- **Negociación**: pedido requiere revisión, aprobación o respuesta.
- **Confirmado**: pedido aprobado y listo para avance operativo.
- **Entregado**: pedido cerrado en la operación.

### Estados complementarios sugeridos para futuro

No incorporar todavía si no hacen falta, pero dejar previstos:

- **Bloqueado**
- **Cancelado**
- **Pendiente de Cliente**
- **Pendiente de Proveedor**

---

## 7. Prioridad Operativa

Cada pedido, negociación o alerta debe poder clasificarse por prioridad:

- **Alta**: requiere acción urgente o bloquea operación.
- **Media**: requiere seguimiento normal.
- **Baja**: informativo o sin impacto inmediato.

La prioridad debe ayudar a ordenar la **Cola de Acción**.

---

## 8. Responsables

El sistema no debe mostrar problemas sin dueño.

Agregar responsable en:

- Cliente
- Pedido
- Negociación
- Alerta Operativa

Ejemplo:

```ts
responsable: "Eli"
```

Esto permite transformar el dashboard en una herramienta de gestión real, no solo en una pantalla informativa.

---

## 8.1. Configuraciones del Sistema

AYRO NEXO debe incluir un modulo **Configuraciones** como parte normal de una app/sistema operativo.

El objetivo es que ajustes menores no requieran cambios de codigo. Todo valor que el cliente razonablemente pueda pedir modificar debe vivir en configuracion.

Configurables base del MVP:

- identidad visible: nombre, subtitulo y descripcion operativa;
- nombres visibles de modulos;
- labels de estados de pedido;
- labels de prioridad;
- labels de severidad;
- colores/variantes visuales asociadas a estados, prioridades y severidades;
- responsables disponibles;
- umbral de pedido sin respuesta, inicialmente 24 horas;
- limites comerciales default para futuros flujos;
- textos de acciones sugeridas.

En el MVP esta configuracion puede ser local y mockeada, pero debe estar separada del JSX para que luego pueda migrar a una pantalla editable o backend.

---

## 9. Reglas de Negocio Críticas

- Si descuento solicitado supera el límite permitido, el pedido pasa a `Negociación`.
- Si plazo solicitado supera el límite permitido, el pedido pasa a `Negociación`.
- Un pedido sin cliente asociado no debe avanzar.
- Un cliente sin condiciones comerciales debe generar alerta operativa.
- Un pedido sin respuesta durante más de 24 horas debe generar alerta.
- Toda negociación debe tener responsable.
- Toda alerta debe tener severidad y acción sugerida.
- Todo cambio relevante de estado debe generar evento de historial.
- Toda aprobación o rechazo debe guardar motivo o comentario.

---

## 10. Flujos Principales

### Pedido estándar

1. Crear/ver cliente.
2. Cargar pedido.
3. Estado inicial `Armado`.
4. Validar condición comercial.
5. Si cumple reglas, pasa a `Confirmado`.
6. Luego pasa a `Entregado`.
7. Se registra historial.

### Pedido con excepción

1. Cargar pedido.
2. Detectar descuento o plazo fuera de límite.
3. Pasar a `Negociación`.
4. Asignar responsable.
5. Aprobar o rechazar.
6. Si se aprueba, pasa a `Confirmado`.
7. Se registra historial.

### Cliente sin condiciones

1. Crear/ver cliente.
2. Detectar falta de condición comercial.
3. Crear alerta.
4. Bloquear avance o marcar advertencia.
5. Cargar condición.
6. Cliente queda habilitado.

### Seguimiento operativo

1. Cambio de estado.
2. Evento de historial.
3. Dashboard actualizado.
4. Cola de acción recalculada.

---

## 11. Dashboard Operativo v2

El dashboard debe dejar de ser solo informativo y pasar a ser decisional.

La implementacion del dashboard debe evitar UI hardcoded. Colores, clases por severidad, labels de prioridad, labels de estado, iconos por estado y variantes visuales deben definirse en una configuracion reutilizable. `page.tsx` debe componer la vista, no contener reglas visuales dispersas.

### Secciones recomendadas

#### 1. Resumen Ejecutivo

- pedidos activos
- pedidos en negociación
- pedidos confirmados
- pedidos entregados
- clientes activos
- alertas abiertas

#### 2. Cola de Acción

La sección más importante.

Debe responder:

> ¿Qué tengo que resolver ahora?

Ejemplos:

- Pedido de Bazar Norte requiere aprobación por descuento.
- Cliente Mayorista Centro no tiene condiciones comerciales.
- Pedido de Supermercado Sur lleva más de 24h sin respuesta.
- Negociación pendiente de aprobación por Sofía.

#### 3. Kanban de Pedidos

Columnas:

- Armado
- Negociación
- Confirmado
- Entregado

Cada tarjeta debería mostrar:

- cliente
- bultos
- prioridad
- responsable
- warning comercial
- fecha

#### 4. Alertas Operativas

Agrupadas por severidad:

- crítica
- alta
- media
- baja

#### 5. Historial Reciente

Timeline simple de eventos importantes.

---

## 12. Validación Frontend-First

### Qué significa

Validar sin backend usando:

- datos mock;
- arrays locales;
- reglas TypeScript;
- componentes conectados a esos datos;
- simulación de flujos reales.

No es hacer pantallas decorativas. Es hacer que el frontend se comporte como si el sistema ya existiera.

---

## 13. Datos Mock Recomendados

### Cliente mock

```ts
export const clientes = [
  {
    id: "cli_001",
    nombre: "Bazar Norte",
    estado: "activo",
    responsable: "Eli",
    descuentoPermitido: 10,
    plazoPermitidoDias: 30,
  },
]
```

### Pedido mock

```ts
export const pedidos = [
  {
    id: "ped_001",
    clienteId: "cli_001",
    bultos: 12,
    fecha: "2026-05-03",
    estado: "Armado",
    prioridad: "alta",
    responsable: "Eli",
    descuentoSolicitado: 15,
    plazoSolicitadoDias: 45,
    observaciones: "Cliente solicita condición especial por volumen.",
  },
]
```

---

## 14. Reglas Locales para Validar MVP

```ts
export function evaluarPedido(pedido, cliente) {
  if (!cliente) {
    return {
      estado: "Bloqueado",
      motivo: "Pedido sin cliente asociado",
      requiereAprobacion: false,
    }
  }

  if (pedido.descuentoSolicitado > cliente.descuentoPermitido) {
    return {
      estado: "Negociacion",
      motivo: "Descuento solicitado supera el límite permitido",
      requiereAprobacion: true,
    }
  }

  if (pedido.plazoSolicitadoDias > cliente.plazoPermitidoDias) {
    return {
      estado: "Negociacion",
      motivo: "Plazo solicitado supera el límite permitido",
      requiereAprobacion: true,
    }
  }

  return {
    estado: "Confirmado",
    motivo: "Pedido dentro de condiciones comerciales",
    requiereAprobacion: false,
  }
}
```

---

## 15. Criterios de Validación del Frontend

El frontend-first queda validado cuando:

- el dashboard muestra correctamente pedidos por estado;
- la cola de acción ordena prioridades reales;
- un pedido fuera de condiciones pasa a negociación;
- un cliente sin condiciones genera alerta;
- un pedido viejo genera alerta por demora;
- cada alerta tiene responsable;
- cada cambio importante genera historial simulado;
- una persona de AYRO entiende qué hacer sin explicación externa.

---

## 16. Arquitectura Técnica MVP

### Stack Principal

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, lucide-react.
- **Backend**: No incluido en el primer MVP.
- **Base de Datos**: No incluida en el primer MVP.
- **Infraestructura**: Desarrollo local con Next.js; despliegue futuro previsto en Vercel cuando el flujo esté validado.
- **Configuracion MVP**: archivos locales versionados, separados entre configuracion operativa y configuracion visual.

---

## 17. Estructura de Carpetas Recomendada

```text
4_AYRO NEXO/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   ├── pedidos/
│   │   ├── negociaciones/
│   │   ├── alertas/
│   │   └── ui/
│   ├── data/
│   │   ├── mock-clientes.ts
│   │   ├── mock-pedidos.ts
│   │   ├── mock-condiciones.ts
│   │   ├── mock-negociaciones.ts
│   │   └── mock-historial.ts
│   ├── domain/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   ├── selectors.ts
│   │   ├── settings.ts
│   │   └── ui-config.ts
│   ├── lib/
│   └── types/
├── public/
├── package.json
├── README.md
├── SPEC.md
├── STACK.md
├── ARQUITECTURA.md
├── MISION.md
└── VISION.md
```

---

## 18. Backend Futuro

El backend no debe construirse completo hasta validar el flujo frontend-first.

Cuando se valide, el backend debe cubrir:

### Entidades

- clientes
- pedidos
- condiciones_comerciales
- negociaciones
- eventos_historial
- alertas_operativas
- responsables/usuarios

### Endpoints mínimos

#### Clientes

```txt
GET    /clientes
POST   /clientes
GET    /clientes/:id
PATCH  /clientes/:id
```

#### Pedidos

```txt
GET    /pedidos
POST   /pedidos
PATCH  /pedidos/:id
PATCH  /pedidos/:id/estado
```

#### Condiciones Comerciales

```txt
GET    /condiciones
POST   /condiciones
PATCH  /condiciones/:id
```

#### Negociaciones

```txt
GET    /negociaciones
POST   /negociaciones
PATCH  /negociaciones/:id/aprobar
PATCH  /negociaciones/:id/rechazar
```

#### Dashboard

```txt
GET /dashboard/resumen
GET /dashboard/alertas
GET /dashboard/cola-accion
```

---

## 19. Orden de Implementación Recomendado

### Sprint 1: Frontend operativo mock

- Dashboard v2.
- Cola de acción.
- Kanban.
- Datos mock centralizados.
- Tipos TypeScript.
- Reglas locales.

### Sprint 2: Flujos simulados

- Cargar pedido.
- Cambiar estado.
- Detectar negociación.
- Generar alerta.
- Registrar historial mock.

### Sprint 3: Módulos frontend

- Clientes.
- Pedidos.
- Condiciones comerciales.
- Negociaciones.
- Historial.
- Configuraciones.

### Sprint 4: Preparación backend

- Definir modelo final.
- Definir endpoints.
- Elegir SQLite/PostgreSQL.
- Preparar migración de mocks a API.

### Sprint 5: Backend mínimo

- CRUD principal.
- Persistencia.
- Reglas en backend.
- Historial automático.
- Dashboard con datos reales.

---

## 20. Fuera de Alcance del Primer MVP

- Prisma/PostgreSQL en el primer ciclo.
- Autenticación.
- Roles y permisos complejos.
- APIs externas.
- Automatizaciones de notificación.
- Reportes avanzados.
- Facturación.
- Integración con WhatsApp.
- IA predictiva.

---

## 21. Riesgos

- **Reglas comerciales ambiguas**: si descuento/plazo no tiene límites claros, el sistema no puede decidir aprobaciones de forma confiable.
- **MVP demasiado amplio**: intentar construir todos los módulos completos antes de validar el flujo puede frenar el avance.
- **Datos mock irreales**: si los mocks no reflejan casos reales, el dashboard puede verse bien pero fallar como herramienta operativa.
- **Persistencia prematura**: agregar base de datos antes de cerrar reglas puede fijar un modelo incorrecto.
- **Falta de responsables**: sin dueño por alerta o pedido, el sistema informa pero no gestiona.
- **Alertas sin prioridad**: demasiadas alertas o severidades poco claras pueden volver ruidoso el tablero.
- **Historial débil**: sin detalle de decisión, se pierde trazabilidad operativa.

---

## 22. Decisión Recomendada

No construir backend todavía.

Primero construir **AYRO NEXO Frontend MVP v2** con:

- datos mock realistas;
- reglas locales;
- cola de acción;
- responsables;
- prioridades;
- kanban operativo;
- historial simulado;
- alertas accionables.

Una vez validado el flujo, recién ahí construir backend.

La secuencia correcta es:

```txt
Flujo validado → Modelo estable → Backend mínimo → Persistencia → Automatización
```

---

## 23. Definición de Éxito

AYRO NEXO MVP será exitoso si una persona de AYRO puede abrir el dashboard y entender en menos de 30 segundos:

1. qué pedidos están activos;
2. qué pedidos están trabados;
3. qué clientes tienen problemas;
4. qué negociaciones requieren aprobación;
5. quién debe resolver cada cosa;
6. cuál es la próxima acción concreta.
