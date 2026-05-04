"use client"

import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useSyncExternalStore,
} from "react"

import {
  createBrowserDemoRepository,
  createInitialDemoState,
} from "@/data/ayro-demo-repository"
import type {
  AyroDataset,
  AyroDemoState,
  AyroPersistenceInfo,
  ConfiguracionLocal,
} from "@/domain/types"

type DemoStore = {
  getSnapshot: () => AyroDemoState
  getServerSnapshot: () => AyroDemoState
  subscribe: (listener: () => void) => () => void
  setDataset: Dispatch<SetStateAction<AyroDataset>>
  setConfig: Dispatch<SetStateAction<ConfiguracionLocal>>
  resetDemoState: () => void
}

export function useAyroDemoState(initialConfig: ConfiguracionLocal): {
  dataset: AyroDataset
  config: ConfiguracionLocal
  persistence: AyroPersistenceInfo
  setDataset: Dispatch<SetStateAction<AyroDataset>>
  setConfig: Dispatch<SetStateAction<ConfiguracionLocal>>
  resetDemoState: () => void
} {
  const store = useMemo(() => createDemoStore(initialConfig), [initialConfig])
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )

  return {
    dataset: state.dataset,
    config: state.config,
    persistence: {
      mode: "localStorage",
      label: "Persistencia local activa",
      sourceLabel: "Demo local persistente",
      backendLabel: "Adapter reemplazable por backend real",
      updatedAt: state.updatedAt,
    },
    setDataset: store.setDataset,
    setConfig: store.setConfig,
    resetDemoState: store.resetDemoState,
  }
}

function createDemoStore(initialConfig: ConfiguracionLocal): DemoStore {
  const repository = createBrowserDemoRepository({ initialConfig })
  const initialState = createInitialDemoState(initialConfig)
  const listeners = new Set<() => void>()
  let state = initialState
  let hasLoadedBrowserState = false

  const emit = () => {
    listeners.forEach((listener) => listener())
  }

  const persist = (nextState: AyroDemoState) => {
    state = nextState
    repository.save(state)
    emit()
  }

  return {
    getSnapshot: () => {
      if (!hasLoadedBrowserState && typeof window !== "undefined") {
        state = repository.load()
        hasLoadedBrowserState = true
      }

      return state
    },
    getServerSnapshot: () => initialState,
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    setDataset: (action) => {
      persist({
        ...state,
        dataset:
          typeof action === "function" ? action(state.dataset) : action,
        updatedAt: createTimestamp(),
      })
    },
    setConfig: (action) => {
      persist({
        ...state,
        config: typeof action === "function" ? action(state.config) : action,
        updatedAt: createTimestamp(),
      })
    },
    resetDemoState: () => {
      state = repository.reset()
      emit()
    },
  }
}

function createTimestamp() {
  return new Date().toISOString()
}
