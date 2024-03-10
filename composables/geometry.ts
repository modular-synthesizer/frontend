import ICoordinates from "~~/lib/interfaces/ICoordinates";

export function polarToCartesian(cx: number, cy: number, r: number, angle: number): ICoordinates {
  const radAngle = (angle + 90) * Math.PI / 180;
  return {
    x: cx + (r * Math.cos(radAngle)),
    y: cy + (r * Math.sin(radAngle)),
  };
}

export function arcPath(cx: number, cy: number, r: number, angleStart: number, angleEnd: number) {
  console.log(cx, cy, r, angleStart, angleEnd)
  const start: ICoordinates = polarToCartesian(cx, cy, r, angleStart);
  const end: ICoordinates = polarToCartesian(cx, cy, r, angleEnd);
  const large: string = Math.abs(angleEnd - angleStart) > 180 ? '1' : '0';

  return `M${start.x},${start.y}A${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}