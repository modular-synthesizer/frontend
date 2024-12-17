import type { Parameter } from "~/types/modules/Parameter";
import { moveValue, setValue } from "~/utils/functions/parameters";
import { DEFAULT_FADER_HEIGHT } from "~~/lib/utils/constants";
import { relativePosition } from "~~/lib/utils/coordinates";

export enum Strategies {
  LINEAR = 'linear',
  DECORRELATED = 'decorrelated',
}

export type EditionStrategies = {
  [key in Strategies]: any;
};

export const EDITION_STRATEGIES: EditionStrategies = {
  [Strategies.LINEAR]: editAsLinear,
  [Strategies.DECORRELATED]: editAsDecorrelated,
}

function editAsLinear({ clientY: y, clientX: x }: MouseEvent) {
  const height: number = selectedControl?.payload.height ?? DEFAULT_FADER_HEIGHT;
  const p: Parameter | null = selectedParameter;
  if (p === null) return;

  const yMin = selectedControl?.payload.y;
  const yMax = yMin + height;

  const currentY = Math.round(relativePosition(x, y).y);
  const ratio = (yMax - currentY) / (yMax - yMin);

  const value: number = (p.maximum - p.minimum) * ratio

  setValue(p, value);
}

function editAsDecorrelated({ clientY: y, clientX: x }: MouseEvent) {
  if (selectedParameter === null) return;
  const delta = y - parameterOrigin.y;
  if (Math.abs(delta) >= 5) {
    moveValue(selectedParameter, - (delta / 5) * selectedParameter.step);
    resetOrigin({ x, y });
  }
}