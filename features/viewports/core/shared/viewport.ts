import type { Position } from "../data/Position.type"
import { DEFAULT_VIEWPORT, MAX_SCALE, MIN_SCALE } from "./Constants"
import type { Viewport } from "../data/Viewport.type"

type ElementsDiffer<T> = (first: T, second: T) => boolean

export const positionsDiffer: ElementsDiffer<Position> = (first, second) =>
  first.x !== second.x || first.y !== second.y

export const viewportsDiffer: ElementsDiffer<Viewport> = (first, second) =>
  positionsDiffer(first.position, second.position) || first.scale !== second.scale

export const isDefaultViewport = (viewport: Viewport): boolean =>
  !viewportsDiffer(viewport, DEFAULT_VIEWPORT)

export const clampScale = (scale: number): number =>
  Math.min(Math.max(MIN_SCALE, scale), MAX_SCALE)