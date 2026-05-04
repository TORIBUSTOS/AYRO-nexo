import { getAyroDataset } from "@/data/source"
import type {
  AyroDataset,
  AyroDemoState,
  ConfiguracionLocal,
} from "@/domain/types"

const STORAGE_KEY = "ayro-nexo.demo-state.v1"
const CURRENT_VERSION = 1

type StoredDemoState = Partial<AyroDemoState>

export type AyroDemoRepository = {
  load: () => AyroDemoState
  save: (state: AyroDemoState) => void
  reset: () => AyroDemoState
}

export function createBrowserDemoRepository({
  initialConfig,
}: {
  initialConfig: ConfiguracionLocal
}): AyroDemoRepository {
  return {
    load: () => loadStoredDemoState(initialConfig),
    save: saveStoredDemoState,
    reset: () => resetStoredDemoState(initialConfig),
  }
}

export function createInitialDemoState(
  initialConfig: ConfiguracionLocal
): AyroDemoState {
  return {
    dataset: cloneDataset(getAyroDataset()),
    config: initialConfig,
    version: CURRENT_VERSION,
    updatedAt: createTimestamp(),
  }
}

function loadStoredDemoState(initialConfig: ConfiguracionLocal): AyroDemoState {
  if (typeof window === "undefined") {
    return createInitialDemoState(initialConfig)
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY)

    if (!rawState) {
      return createInitialDemoState(initialConfig)
    }

    const parsedState = JSON.parse(rawState) as StoredDemoState

    if (!isValidDataset(parsedState.dataset) || !parsedState.config) {
      return createInitialDemoState(initialConfig)
    }

    return {
      dataset: parsedState.dataset,
      config: mergeConfigDefaults(initialConfig, parsedState.config),
      version: CURRENT_VERSION,
      updatedAt: parsedState.updatedAt ?? createTimestamp(),
    }
  } catch {
    return createInitialDemoState(initialConfig)
  }
}

function saveStoredDemoState(state: AyroDemoState) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      version: CURRENT_VERSION,
    })
  )
}

function resetStoredDemoState(initialConfig: ConfiguracionLocal): AyroDemoState {
  const state = createInitialDemoState(initialConfig)

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return state
}

function isValidDataset(dataset: unknown): dataset is AyroDataset {
  if (!dataset || typeof dataset !== "object") {
    return false
  }

  const candidate = dataset as Partial<Record<keyof AyroDataset, unknown>>

  return (
    Array.isArray(candidate.clientes) &&
    Array.isArray(candidate.pedidos) &&
    Array.isArray(candidate.negociaciones) &&
    Array.isArray(candidate.historial)
  )
}

function cloneDataset(dataset: AyroDataset): AyroDataset {
  return {
    clientes: dataset.clientes.map((cliente) => ({ ...cliente })),
    pedidos: dataset.pedidos.map((pedido) => ({ ...pedido })),
    negociaciones: dataset.negociaciones.map((negociacion) => ({
      ...negociacion,
    })),
    historial: dataset.historial.map((evento) => ({ ...evento })),
  }
}

function mergeConfigDefaults(
  defaults: ConfiguracionLocal,
  stored: ConfiguracionLocal
): ConfiguracionLocal {
  return {
    ...defaults,
    ...stored,
    estadosPedido: {
      ...defaults.estadosPedido,
      ...stored.estadosPedido,
    },
    prioridades: {
      ...defaults.prioridades,
      ...stored.prioridades,
    },
    severidades: {
      ...defaults.severidades,
      ...stored.severidades,
    },
  }
}

function createTimestamp() {
  return new Date().toISOString()
}
