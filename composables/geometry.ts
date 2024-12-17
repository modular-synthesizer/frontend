import type { Coordinates } from "~/types/utils/Coordinates";

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