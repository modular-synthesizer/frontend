import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "~/lib/utils/constants";
import type { ScaledCoordinates } from "~/types/utils/Coordinates";

export function zoom(target: ScaledCoordinates, $event: WheelEvent) {
  let s: number = Math.abs(target.scale + $event.deltaY * -ZOOM_RATIO);
  return Math.min(Math.max(MAX_ZOOM_OUT, s), MAX_ZOOM_IN);
}