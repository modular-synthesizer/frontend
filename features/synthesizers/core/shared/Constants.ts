import type { Position } from "../data/Position.type";
import type { ViewPort } from "../data/Synthesizer.type";

export const DEFAULT_POSITION: Position = { x: 0, y: 0}
export const DEFAULT_VIEWPORT: ViewPort = { position: DEFAULT_POSITION, scale: 1.0 }