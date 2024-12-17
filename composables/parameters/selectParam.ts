import type { Parameter } from '~/types/modules/Parameter';
import type { Control } from '~/types/tools/Control';
import type { Coordinates } from '~/types/utils/Coordinates';

// This composable holds the logic to know which parameter is currently being edited.
// It does not handle the edition itself, the value or the coordinates.

export let selectedParameter: Parameter|null = null;

export let selectedControl: Control|null = null;

export const parameterOrigin: Coordinates = { x: 0, y: 0 };

interface ParametersSelection extends Coordinates {
  control: Control;
  parameter: Parameter;
}

export function selectParameter({ parameter, control, x, y }: ParametersSelection) {
  selectedParameter = parameter;
  selectedControl = control;
  resetOrigin({ x, y });
}

export function resetOrigin({ x, y }: Coordinates) {
  parameterOrigin.x = x;
  parameterOrigin.y = y;
}

export function unselectParameter() {
  selectedParameter = null;
  selectedControl = null;
}