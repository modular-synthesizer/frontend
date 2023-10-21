import { IControl } from '~~/lib/interfaces/IControl';
import ICoordinates from '~~/lib/interfaces/ICoordinates';
import Parameter from '~~/lib/wrappers/Parameter';

// This composable holds the logic to know which parameter is currently being edited.
// It does not handle the edition itself, the value or the coordinates.

export let selectedParameter: Parameter|null = null;

export let selectedControl: IControl|null = null;

export const parameterOrigin: ICoordinates = { x: 0, y: 0 };

export function selectParameter(parameter: Parameter, control: IControl, coords: ICoordinates) {
  selectedParameter = parameter;
  selectedControl = control;
  resetOrigin(coords);
}

export function resetOrigin({ x, y }: ICoordinates) {
  parameterOrigin.x = x;
  parameterOrigin.y = y;
}

export function unselectParameter() {
  selectedParameter = null;
  selectedControl = null;
}