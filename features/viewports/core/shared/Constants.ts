import type { Position } from "../data/Position.type"
import type { Viewport } from "../data/Viewport.type"

export const DEFAULT_POSITION: Position = { x: 0, y: 0}
export const DEFAULT_VIEWPORT: Viewport = { position: DEFAULT_POSITION, scale: 1.0 }

// This value is kind of magic. It has been determined after trials and
// errors as the best value to apply to the wheel scroll to zoom in and
// out smoothly without it being too fast or too slow.
export const ZOOM_RATIO = 0.005;

// This value is the minimum value the ratio can be "zoomed out" with
// It is a magic value obtained after some trials and errors too.
export const MIN_SCALE = 0.5;

// This value is the maximum value the ratio can be "zoomed in" with
// It is a magic value obtained after some trials and errors too.
export const MAX_SCALE = 2;