import type { Position } from "../data/Position.type"
import type { Viewport } from "../data/Synthesizer.type"
import { DEFAULT_VIEWPORT } from "./Constants"

type ElementsDiffer<T> = (first: T, second: T) => boolean

export const positionsDiffer: ElementsDiffer<Position> = (first, second) =>
  first.x !== second.x || first.y !== second.y

export const viewportsDiffer: ElementsDiffer<Viewport> = (first, second) =>
  positionsDiffer(first.position, second.position) || first.scale !== second.scale

export const isDefaultViewport = (viewport: Viewport): boolean =>
  !viewportsDiffer(viewport, DEFAULT_VIEWPORT)