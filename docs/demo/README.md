# AYRO NEXO - Demo Walkthrough

Este recorrido muestra el estado actual de AYRO NEXO como demo operativa persistente.

La demo sigue siendo frontend-first:

- no usa backend real;
- no usa base de datos;
- no usa autenticacion;
- persiste cambios en `localStorage`;
- mantiene la UI desacoplada de la fuente de datos mediante la capa `src/data`.

## 1. Dashboard operativo

Vista principal del centro de comando comercial: metricas, cola de accion, alertas, kanban e historial reciente.

![Dashboard operativo](./01-dashboard-operativo.png)

## 2. Clientes y seguimiento comercial

La vista Clientes muestra condiciones, ultimo pedido, dias sin pedido y seguimiento de clientes dormidos para reactivar contacto comercial.

![Clientes dormidos](./02-clientes-dormidos.png)

## 3. Pedidos operables

Pedidos permite simular evaluacion comercial, crear pedidos locales y mover estados operativos sin backend.

![Pedidos operacion local](./03-pedidos-operacion-local.png)

## 4. Negociaciones

Negociaciones agrupa excepciones por estado y permite aprobar o rechazar decisiones en la demo persistente.

![Negociaciones decision](./04-negociaciones-decision.png)

## 5. Condiciones comerciales

Condiciones centraliza limites por cliente y permite modificar descuento/plazo para recalcular alertas y evaluaciones.

![Condiciones comerciales](./05-condiciones-comerciales.png)

## 6. Historial operativo

Historial muestra eventos base y eventos locales generados por acciones de la demo.

![Historial operativo](./06-historial-operativo.png)

## 7. Configuraciones y persistencia

Configuraciones muestra umbrales operativos, persistencia local activa, fuente actual y reset de datos locales.

![Configuraciones persistencia](./07-configuraciones-persistencia.png)

## Como reproducir

Desde la raiz del repo:

```bash
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

Tambien se puede iniciar con:

```powershell
.\iniciar-ayro-nexo.bat
```

## Nota de producto

Estas capturas muestran la demo actual. El siguiente salto no es agregar mas UI por volumen, sino consolidar Sprint 4.5:

- modelo operativo real;
- ordenes comerciales;
- proveedores;
- facturacion;
- direcciones logisticas;
- importacion segura de datos reales anonimizados;
- eliminacion progresiva de mocks irreales.
