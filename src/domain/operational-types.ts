export type EstadoClienteOperativo = "activo" | "observado" | "inactivo"

export type EstadoProveedor = "activo" | "observado" | "inactivo"

export type TipoDireccionCliente =
  | "principal"
  | "entrega"
  | "facturacion"
  | "sucursal"
  | "otro"

export type EstadoOperativoOrden =
  | "pendiente"
  | "ordenada"
  | "en_seguimiento"
  | "entregada"
  | "observada"
  | "bloqueada"

export type EstadoFacturacionOrden =
  | "sin_facturar"
  | "parcial"
  | "facturada"
  | "diferencia_detectada"

export type SeveridadOperativa = "critica" | "alta" | "media" | "baja"

export type EstadoAlertaOperativaReal = "abierta" | "resuelta"

export type EntidadOperativa =
  | "cliente"
  | "direccion_cliente"
  | "proveedor"
  | "orden_comercial"
  | "factura"
  | "alerta"

export type ClienteOperativo = {
  id: string
  nombre: string
  estado: EstadoClienteOperativo
  responsable?: string
  observaciones?: string
  ultimoMovimientoFecha?: string
}

export type DireccionCliente = {
  id: string
  clienteId: string
  direccion: string
  tipo: TipoDireccionCliente
  localidad?: string
  provincia?: string
  observaciones?: string
  requiereVisita?: boolean
}

export type Proveedor = {
  id: string
  nombre: string
  estado: EstadoProveedor
  contacto?: string
  observaciones?: string
}

export type OrdenComercial = {
  id: string
  fechaOrden: string
  clienteId: string
  proveedorId: string
  montoOrden: number | null
  montoFacturado: number | null
  facturaNumero: string | null
  estadoOperativo: EstadoOperativoOrden
  estadoFacturacion: EstadoFacturacionOrden
  observaciones?: string
  origenImportacion?: string
}

export type EventoOperativo = {
  id: string
  entidad: EntidadOperativa
  entidadId: string
  accion: string
  fecha: string
  responsable: string
  detalle: string
}

export type TipoAlertaOperativaReal =
  | "orden-sin-factura"
  | "facturacion-parcial"
  | "diferencia-facturacion"
  | "cliente-sin-direccion"
  | "proveedor-observado"
  | "registro-incompleto"

export type AlertaOperativaReal = {
  id: string
  tipo: TipoAlertaOperativaReal
  titulo: string
  detalle: string
  severidad: SeveridadOperativa
  entidadAsociada: EntidadOperativa
  entidadId: string
  responsable: string
  estado: EstadoAlertaOperativaReal
  accionSugerida: string
}

export type AyroOperationalDataset = {
  clientes: ClienteOperativo[]
  direcciones: DireccionCliente[]
  proveedores: Proveedor[]
  ordenes: OrdenComercial[]
  historial: EventoOperativo[]
}

export type RawVentaRow = {
  sourceFile: string
  sourceRow: number
  fecha: string | null
  cliente: string | null
  proveedor: string | null
  montoOrden: number | null
  facturado: number | null
  facturaNumero: string | null
}

export type RawDireccionRow = {
  sourceFile: string
  sourceRow: number
  marcador: string | null
  cliente: string | null
  direccion1: string | null
  direccion2: string | null
}

export type ImportIssueSeverity = "error" | "warning" | "info"

export type ImportIssue = {
  id: string
  severity: ImportIssueSeverity
  sourceFile: string
  sourceRow: number
  field?: string
  message: string
}

export type NormalizedImportPreview = {
  rawVentas: RawVentaRow[]
  rawDirecciones: RawDireccionRow[]
  issues: ImportIssue[]
}
