import type { AyroDataset } from "@/domain/types"

import { clientes } from "./mock-clientes"
import { historial } from "./mock-historial"
import { negociaciones } from "./mock-negociaciones"
import { pedidos } from "./mock-pedidos"

export const ayroDataset: AyroDataset = {
  clientes,
  pedidos,
  negociaciones,
  historial,
}
