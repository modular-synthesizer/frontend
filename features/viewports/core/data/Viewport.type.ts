import type { Position } from "./Position.type";

/**
 * Represents the position and scale of an element on the screen.
 */
export type Viewport = {
  /** The position determines where the element set in its entirety will be represented on screen. */
  position: Position
  /** The scale is the zoom level, 1 is not zoom, < 1 is zommed out, > 1 is zoomed in. */
  scale: number
}