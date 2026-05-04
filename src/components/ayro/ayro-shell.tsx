"use client"

import type { ReactNode } from "react"
import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ayroSettings } from "@/domain/settings"
import type { AyroViewId } from "@/domain/types"
import { cn } from "@/lib/utils"

import { BrandIcon, iconMap } from "./icon-map"

export function AyroShell({
  activeView,
  activePackages,
  children,
  onNavigate,
  onPrimaryAction,
}: {
  activeView: AyroViewId
  activePackages: number
  children: ReactNode
  onNavigate: (view: AyroViewId) => void
  onPrimaryAction?: () => void
}) {
  const view = ayroSettings.views[activeView]

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[272px_1fr]">
        <aside className="border-b border-white/10 bg-[#090d16]/95 px-5 py-5 xl:border-b-0 xl:border-r xl:px-6">
          <div className="flex items-center justify-between xl:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <BrandIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-[0.16em] text-white">
                  {ayroSettings.app.name}
                </h1>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/70">
                  {ayroSettings.app.subtitle}
                </p>
              </div>
            </div>

            <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200 xl:mt-7">
              {ayroSettings.dashboard.onlineLabel}
            </Badge>
          </div>

          <nav className="mt-6 grid gap-2 sm:grid-cols-3 xl:mt-10 xl:block xl:space-y-2">
            {ayroSettings.navigation.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = item.id === activeView

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                    isActive
                      ? "border-cyan-300/35 bg-cyan-300/12 text-white shadow-[0_0_24px_rgba(34,211,238,0.10)]"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-8 hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 xl:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {ayroSettings.dashboard.pulseTitle}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {ayroSettings.dashboard.activePackagesLabel}
                </span>
                <span className="font-semibold text-white">
                  {activePackages}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900">
                <div className="h-2 w-3/4 rounded-full bg-cyan-300" />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {ayroSettings.dashboard.localDataNote}
              </p>
            </div>
          </div>
        </aside>

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/75">
                {ayroSettings.app.description}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {view.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {view.description}
              </p>
            </div>

            <Button
              type="button"
              onClick={onPrimaryAction}
              className="h-10 w-fit rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              {ayroSettings.dashboard.primaryAction}
            </Button>
          </header>

          {children}
        </section>
      </div>
    </main>
  )
}
