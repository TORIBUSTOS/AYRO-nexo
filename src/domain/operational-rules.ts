import type {
  AlertaOperativaReal,
  DireccionCliente,
  EstadoFacturacionOrden,
  OrdenComercial,
  Proveedor,
} from "@/domain/operational-types"

const DEFAULT_TOLERANCE = 1

export function calcularDiferenciaFacturacion(
  orden: Pick<OrdenComercial, "montoOrden" | "montoFacturado">
) {
  return (orden.montoOrden ?? 0) - (orden.montoFacturado ?? 0)
}

export function calcularEstadoFacturacion(
  orden: Pick<OrdenComercial, "montoOrden" | "montoFacturado">,
  tolerance = DEFAULT_TOLERANCE
): EstadoFacturacionOrden {
  const montoOrden = orden.montoOrden
  const montoFacturado = orden.montoFacturado

  if ((montoFacturado === null || montoFacturado === 0) && montoOrden) {
    return "sin_facturar"
  }

  if (montoOrden === null && montoFacturado && montoFacturado > 0) {
    return "diferencia_detectada"
  }

  if (montoOrden === null || montoFacturado === null) {
    return "sin_facturar"
  }

  const diferencia = montoOrden - montoFacturado

  if (Math.abs(diferencia) <= tolerance) {
    return "facturada"
  }

  if (montoFacturado < montoOrden) {
    return "parcial"
  }

  return "diferencia_detectada"
}

export function hasDireccionValida(
  clienteId: string,
  direcciones: DireccionCliente[]
) {
  return direcciones.some(
    (direccion) =>
      direccion.clienteId === clienteId && direccion.direccion.trim().length > 0
  )
}

export function generarAlertasOrdenesOperativas({
  ordenes,
  direcciones,
  proveedores,
  responsableDefault = "Sin asignar",
}: {
  ordenes: OrdenComercial[]
  direcciones: DireccionCliente[]
  proveedores: Proveedor[]
  responsableDefault?: string
}): AlertaOperativaReal[] {
  const alertas: AlertaOperativaReal[] = []

  for (const orden of ordenes) {
    const estadoFacturacion = calcularEstadoFacturacion(orden)
    const proveedor = proveedores.find((item) => item.id === orden.proveedorId)
    const responsable = responsableDefault

    if (estadoFacturacion === "sin_facturar") {
      alertas.push({
        id: `alert_orden_sin_factura_${orden.id}`,
        tipo: "orden-sin-factura",
        titulo: "Orden sin factura",
        detalle: "La orden tiene monto cargado pero no registra facturación.",
        severidad: "alta",
        entidadAsociada: "orden_comercial",
        entidadId: orden.id,
        responsable,
        estado: "abierta",
        accionSugerida: "Revisar estado de facturación con el proveedor.",
      })
    }

    if (estadoFacturacion === "parcial") {
      alertas.push({
        id: `alert_facturacion_parcial_${orden.id}`,
        tipo: "facturacion-parcial",
        titulo: "Facturación parcial",
        detalle: "El monto facturado es menor al monto de la orden.",
        severidad: "media",
        entidadAsociada: "orden_comercial",
        entidadId: orden.id,
        responsable,
        estado: "abierta",
        accionSugerida: "Validar si existe factura pendiente o entrega parcial.",
      })
    }

    if (estadoFacturacion === "diferencia_detectada") {
      alertas.push({
        id: `alert_diferencia_facturacion_${orden.id}`,
        tipo: "diferencia-facturacion",
        titulo: "Diferencia de facturación",
        detalle: "La relación entre orden y facturación requiere revisión.",
        severidad: "critica",
        entidadAsociada: "orden_comercial",
        entidadId: orden.id,
        responsable,
        estado: "abierta",
        accionSugerida: "Conciliar orden, factura y datos de importación.",
      })
    }

    if (!hasDireccionValida(orden.clienteId, direcciones)) {
      alertas.push({
        id: `alert_cliente_sin_direccion_${orden.clienteId}`,
        tipo: "cliente-sin-direccion",
        titulo: "Cliente sin dirección válida",
        detalle: "El cliente asociado a la orden no tiene dirección logística cargada.",
        severidad: "alta",
        entidadAsociada: "cliente",
        entidadId: orden.clienteId,
        responsable,
        estado: "abierta",
        accionSugerida: "Completar dirección antes de avanzar seguimiento.",
      })
    }

    if (proveedor?.estado === "observado") {
      alertas.push({
        id: `alert_proveedor_observado_${orden.id}`,
        tipo: "proveedor-observado",
        titulo: "Proveedor observado",
        detalle: "La orden está asociada a un proveedor observado.",
        severidad: "media",
        entidadAsociada: "proveedor",
        entidadId: proveedor.id,
        responsable,
        estado: "abierta",
        accionSugerida: "Validar proveedor antes de confirmar avance operativo.",
      })
    }
  }

  return dedupeAlertas(alertas)
}

function dedupeAlertas(alertas: AlertaOperativaReal[]) {
  const seen = new Set<string>()

  return alertas.filter((alerta) => {
    if (seen.has(alerta.id)) {
      return false
    }

    seen.add(alerta.id)
    return true
  })
}
