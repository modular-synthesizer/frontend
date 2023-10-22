import { IControl } from '~~/lib/interfaces/IControl';
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import Parameter from '~~/lib/wrappers/Parameter';

// This composable holds the logic to know which parameter is currently being edited.
// It does not handle the edition itself, the value or the coordinates.

export let selectedParameter: Parameter|null = null;

export let selectedControl: IControl|null = null;

export const parameterOrigin: ICoordinates = { x: 0, y: 0 };

interface ParametersSelection extends ICoordinates {
  control: IControl;
  parameter: Parameter;
}

export function selectParameter({ parameter, control, x, y }: ParametersSelection) {
  selectedParameter = parameter;
  selectedControl = control;
  resetOrigin({ x, y });
}

export function resetOrigin({ x, y }: ICoordinates) {
  parameterOrigin.x = x;
  parameterOrigin.y = y;
}

export function unselectParameter() {
  selectedParameter = null;
  selectedControl = null;
}