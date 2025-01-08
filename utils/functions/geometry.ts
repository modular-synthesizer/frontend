import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "~/lib/utils/constants";
import type { Coordinates, ScaledCoordinates } from "~/types/utils/Coordinates";

export function zoom(target: ScaledCoordinates, $event: WheelEvent) {
  let s: number = Math.abs(target.scale + $event.deltaY * -ZOOM_RATIO);
  return Math.min(Math.max(MAX_ZOOM_OUT, s), MAX_ZOOM_IN);
}

export function polarToCartesian(cx: number, cy: number, r: number, angle: number): Coordinates {
  const radAngle = (angle + 90) * Math.PI / 180;
  return {
    x: cx + (r * Math.cos(radAngle)),
    y: cy + (r * Math.sin(radAngle)),
  };
}

export function arcPath(cx: number, cy: number, r: number, angleStart: number, angleEnd: number) {
  const start: Coordinates = polarToCartesian(cx, cy, r, angleStart);
  const end: Coordinates = polarToCartesian(cx, cy, r, angleEnd);
  const large: string = Math.abs(angleEnd - angleStart) > 180 ? '1' : '0';

  return `M${start.x},${start.y}A${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}