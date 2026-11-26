import type { ListStatus } from "./ListStatus.type"

export type LoadedResource = "synthesizer" | "modules"| "generators" | "cables"

export type LoadingState = Readonly<Record<LoadedResource, ListStatus>>