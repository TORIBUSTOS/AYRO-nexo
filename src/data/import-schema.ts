export const ventasHeaderAliases = {
  fecha: ["fecha", "fecha oc", "fecha orden", "fecha pedido"],
  cliente: ["cliente", "cliente ayro"],
  proveedor: ["proveedor", "prov"],
  montoOrden: ["monto orden", "monto ordenado", "orden", "monto oc"],
  facturado: ["facturado", "monto facturado", "facturacion"],
  facturaNumero: ["factura nº", "factura n°", "factura numero", "factura nro"],
} as const

export const direccionesHeaderAliases = {
  marcador: ["marcador", "estado", "accion", "visita"],
  cliente: ["cliente", "cliente ayro"],
  direccion1: ["direccion 1", "dirección 1", "direccion", "dirección"],
  direccion2: ["direccion 2", "dirección 2", "segunda direccion"],
} as const

export type VentasImportField = keyof typeof ventasHeaderAliases

export type DireccionesImportField = keyof typeof direccionesHeaderAliases

export function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
}

export function resolveVentasField(header: string): VentasImportField | null {
  const normalized = normalizeHeader(header)

  for (const [field, aliases] of Object.entries(ventasHeaderAliases)) {
    if ((aliases as readonly string[]).some((alias) => normalizeHeader(alias) === normalized)) {
      return field as VentasImportField
    }
  }

  return null
}

export function resolveDireccionesField(
  header: string
): DireccionesImportField | null {
  const normalized = normalizeHeader(header)

  for (const [field, aliases] of Object.entries(direccionesHeaderAliases)) {
    if ((aliases as readonly string[]).some((alias) => normalizeHeader(alias) === normalized)) {
      return field as DireccionesImportField
    }
  }

  return null
}

export const requiredVentasFields: VentasImportField[] = [
  "fecha",
  "cliente",
  "proveedor",
  "montoOrden",
]

export const requiredDireccionesFields: DireccionesImportField[] = [
  "cliente",
  "direccion1",
]
